var Stopwatch = function () {
        
        //A view element which controls the display of an mm:ss display
        var Display = function(container) {
                
                //State
                this.value = 0;
                this.dividerVisible = true;
                
                //DOM
                this.container = null;
                this.element = null;
                this.elements = null;
                
                //Initialisation
                this.createElements();
                this.attach(container);
        }
        
        //Create DOM nodes for object
        Display.prototype.createElements = function() {
                if (this.element) {
                        return this.element;
                }
                
                //Create DOM node
                var createElement = function(className, value) {
                        var node = document.createElement('li');
                        node.className = className;
                        var text = document.createTextNode(value);
                        node.appendChild(text);
                        return node;
                };
                
                //Create DOM node for the : divider
                var createDivider = function(className) {
                        return createElement(className, ':');
                };
                
                //Create two DOM noes for digit display
                var createDigits = function(className) {
                        return [
                                createElement(className + ' digit-0', '0'),
                                createElement(className + ' digit-0', '0')
                        ];
                };
                
                //Create nodes for each digit
                this.elements = {
                        seconds: 	createDigits('seconds digit'),
                        centiseconds: 	createDigits('centiseconds digit'),
                        minutes: 	createDigits('minutes digit'),
                        dividers: [
                                        createDivider('seconds divider'),
                                        createDivider('centiseconds divider')
                        ]
                };
                
                //Create root node for the widget
                this.element = document.createElement('ul');
                this.element.className = 'display';
                
                //Attach child nodes to the root
                with (this.element) {
                        appendChild(this.elements.minutes[0]);
                        appendChild(this.elements.minutes[1]);
                        appendChild(this.elements.dividers[0]);
                        appendChild(this.elements.seconds[0]);
                        appendChild(this.elements.seconds[1]);
                        appendChild(this.elements.dividers[1]);
                        appendChild(this.elements.centiseconds[0]);
                        appendChild(this.elements.centiseconds[1]);
                }
                
                return this.element;
        }
        
        //Attach DOM elemeents for display to a container
        Display.prototype.attach = function(container) {
                this.container = container;
                this.container.appendChild(this.element);
        }
        
        //Show time on display
        Display.prototype.show = function(seconds) {
                var showDigit = function(element, digit) {
                        element.innerHTML = digit;
                        element.className = element.className.replace(/ digit\-./, ' digit-' + digit);
                }
                
                var showDigits = function(elements, value) {
                        showDigit(elements[0], Math.floor((value / 10) % 10));
                        showDigit(elements[1], value % 10);
                }
                
                seconds = seconds > 0 ? seconds : 0;
                
                showDigits(this.elements.minutes, Math.floor(seconds / 60));
                showDigits(this.elements.seconds, Math.floor(seconds % 60));
                showDigits(this.elements.centiseconds, Math.floor((seconds * 100) % 100));
                
                this.value = seconds;
        }
        
        //Show or hide the : dividers
        Display.prototype.setDividerVisible = function(visible) {
                if (visible == this.dividerVisible) {
                        return;
                }
                
                var hide = function(element) {
                        element.className += ' divider-off';
                }
                
                var show = function(element) {
                        element.className = element.className.replace(/ divider-off/g, '');
                }
                
                if (visible) {
                        show(this.elements.dividers[0]);
                        show(this.elements.dividers[1]);
                } else {
                        hide(this.elements.dividers[0]);
                        hide(this.elements.dividers[1]);
                }
                this.dividerVisible = visible;
        }
        
        //Element to control a Display view
        var Timer = function(display) {
                this.display = display
                this.displayInterval = null;
                this.splitTimeout = null;
                this.running = false;
                
                this.splits = [];
                this.offset = 0;
                this.startTime = null;
        };
        
        //Stop updating the display with the time
        Timer.prototype.stopDisplay = function() {
                if (this.displayInterval) {
                        window.clearInterval(this.displayInterval);
                        this.displayInterval = null;
                        this.display.setDividerVisible(true);
                }
        }
        
        //Start updaing the display with the time
        Timer.prototype.startDisplay = function() {
                if (this.running) {
                        var that = this;
                        this.stopDisplay();
                        this.displayInterval = window.setInterval(function() {
                                var time = that.getTime();
                                that.display.setDividerVisible(time % 1 < 0.5);
                                that.display.show(time);
                        }, 50);
                }
        };
        
        //The current time (in seconds as a float)
        Timer.prototype.getTime = function() {
                var time = this.offset;
                if (this.running) {
                        time +=	((new Date()).getTime() - this.startTime) / 1000;
                }
                return time;
        };
        
        //Start the timer
        Timer.prototype.start = function() {
                if (!this.running) {
                        this.running = true;
                        this.startTime = (new Date()).getTime();
                        this.startDisplay();
                }
        };
         
        //Stop (pause) the timer
        Timer.prototype.stop = function() {
                if (this.running) {
                        this.offset = this.getTime();
                        this.startTime = null;
                        this.running = false;
                        this.stopDisplay();
                }
        };
        
        //Create a split time and temporarily halt the
        //display for updating.
        Timer.prototype.split = function() {
                var time = this.getTime();
                
                this.splits.push(time);
                this.stopDisplay(); 
                this.display.show(time);
                
                //If we have any other split times that will
                //try and restart the display then stop them.
                if (this.splitTimeout) {
                        window.clearTimeout(this.splitTimeout);
                }
                
                //Reattach the display in one second.
                var that = this;
                this.splitTimeout = window.setTimeout(function() {
                        that.startDisplay();
                        that.splitTimeout = null;
                }, 1000);
        };
        
        //Reset the timer completely.
        Timer.prototype.reset = function() {
                this.startTime = (new Date()).getTime();
                this.splits = [];
                this.offset = 0;
                this.display.show(0);
        };
        
        //Get list of split times.
        Timer.prototype.getSplitTimes = function() {
                return this.splits;
        }
        
        //Is the timer running?
        Timer.prototype.isRunning = function() {
                return this.running;
        }
        
        //Namespaced variables.
        return {
                Display : Display,
                Timer: Timer
        };
}();
