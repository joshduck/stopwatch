if (typeof window.System == "undefined") {
    
    console.log('debug: Initialising gadget proxy.');
    
    var System = {
        Gadget : {
            Flyout : {
                document : null,
                file: null,
                show : false,
                
                //Not implemented
                onHide : null,
                onShow : null
            }
        }
    }
    
    window.attachEvent('onload', function() {
        var file = null;
        var frame = null;
        var shown = false;
        var flyout = window.System.Gadget.Flyout;
        
        var initFrame = function() {
            flyout.document = frame.contentWindow.document;
            console.log('debug: Captured flyout document.');
        }
        
        var createFrame = function() {
            frame = document.createElement('iframe');
            frame.style.position = 'absolute';
            frame.style.top = 10;
            frame.style.right = 10;
            frame.style.width = 200;
            frame.style.height = 500;
            frame.style.border = '1px solid black';
            frame.attachEvent('onload', initFrame);
            document.body.appendChild(frame);
        }
        
        var checkStatus = function() {
            
            if (flyout.file != file) {
                console.log('debug: Show file '+ flyout.file);
                frame.src = window.System.Gadget.Flyout.file;
                flyout.document = frame.document;
                file = window.System.Gadget.Flyout.file;
            }
            
            if (flyout.show != shown) {
                frame.style.visibility = flyout.show ? 'visible' : 'hidden';
                shown = flyout.show;
                
                if (typeof flyout.onShow == "function") {
                    flyout.onShow.call();
                }
            }
        }
        
        createFrame();
        window.setInterval(checkStatus, 1000);
    });
}