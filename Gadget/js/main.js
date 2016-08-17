var Button = function(label, container) {
        this.enabled = true;
        this.onclick = function() {};
        this.element = Button.createElement(label, container);
        this.display = this.element.style.display;
        
        this.initEvents();
}

Button.createElement = function(label, container) {
        var element = document.createElement('button');
        element.innerText = label;
        element.className = 'action';
        container.appendChild(element);
        return element;
}

Button.prototype.initEvents = function() {
        var that = this;
        this.element.onclick = function() {
                if (that.enabled) {
                        that.onclick();
                }
                return false;
        }
}

Button.prototype.enable = function() {
        this.enabled = true;
        this.element.className = this.element.className.replace(/ disabled/g, '');
}

Button.prototype.disable = function() {
        this.enabled = false;
        this.element.className = this.element.className + ' disabled';
}

Button.prototype.show = function() {
        this.element.style.display = this.display;
}

Button.prototype.hide = function() {
        if (this.element.style.display != 'none') {
                this.display = this.element.style.display;
                this.element.style.display = 'none';
        }
}
        
var Main = {
        
        //UI Objects
        actionBar : null,
        mainDisplay : null,
        buttons : null,
        timer : null,
        flyout : null,
        
        //Main loader
        init : function() {
                this.initUI();
                this.initFlyout();
                this.initUIEvents();
        },
        
        //Set up the flyout window
        initFlyout : function() {
                this.flyout = System.Gadget.Flyout;
                this.flyout.file = 'flyout.html';
        },
        
        //Build UI objects
        initUI : function() {
                
                this.actionBar = document.getElementById('actions');
                this.mainDisplay = document.getElementById('display');
                
                this.buttons = {
                        start : new Button('Start', this.actionBar),
                        stop : new Button('Stop', this.actionBar),
                        reset : new Button('Reset', this.actionBar),
                        split : new Button('Split', this.actionBar)
                };
                
                this.timer = new Stopwatch.Timer(new Stopwatch.Display(this.mainDisplay));
                
                this.resetButtons();    
        },
        
        //UI actions
        initUIEvents : function() {
                this.mainDisplay.onclick = function() {
                        if (Main.timer.isRunning()) {
                                Main.timer.stop();
                        } else {
                                Main.timer.start();
                        }
                        Main.resetButtons();
                };
                
                this.buttons.start.onclick = function() {
                        Main.timer.start();
                        Main.resetButtons();
                };
                
                this.buttons.stop.onclick = function() {
                        Main.timer.stop();
                        Main.resetButtons();
                };
                
                this.buttons.reset.onclick = function() {
                        Main.timer.reset();
                        Main.resetButtons();
                        Main.clearSplits();
                };
                
                this.buttons.split.onclick = function() {
                        Main.timer.split();
                        var splits = Main.timer.getSplitTimes();
                        if (splits.length > 0 && splits.length <= 5) {
                                Main.addSplit(splits[splits.length - 1]);
                        }
                };
        },
        
        //Add split times to UI
        addSplit : function(time) {
                var callback = function() {
                        System.Gadget.Flyout.document.Flyout.addSplit(time);
                };
                
                if (this.flyout.show) {
                        callback();
                } else {
                        this.flyout.onShow = callback;
                        this.flyout.show = true;
                }
        },
        
        //Clear all split times from UI
        clearSplits : function() {
                this.flyout.show = false;
        },
        
        //Reset button states based on whether timer is running
        resetButtons : function() {
                if (this.timer.isRunning()) {				
                        this.buttons.start.hide();
                        this.buttons.stop.show();
                        this.buttons.split.enable();
                } else {
                        this.buttons.start.show();
                        this.buttons.stop.hide();
                        this.buttons.split.disable();
                }
        }
};

window.attachEvent('onload', function() {
        Main.init();
});