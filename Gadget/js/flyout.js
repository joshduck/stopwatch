var Flyout = {
        
        //UI Objects
        splitList : null,
        
        //Main loader
        init : function() {
                Flyout.initUI();
                Flyout.initUIEvents();
        },
        
        //Build UI objects
        initUI : function() {
                Flyout.splitList = document.getElementById('splits');  
        },
        
        //UI actions
        initUIEvents : function() {
        },
        
        //Add split times to UI
        addSplit : function(time) {
                var container = document.createElement('li');
                var display = new Stopwatch.Display(container);
                display.show(time);
                Flyout.splitList.appendChild(container);
        },
        
        //Clear all split times from UI
        clearSplits : function() {
                while (this.splitList.childNodes.length) {
                        container.removeChild(container.childNodes[0]);
                }
        }
};

document.Flyout = Flyout;
window.attachEvent('onload', function() {
        Flyout.init();
});

