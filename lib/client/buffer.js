var Util, DOM;

(function(Util, DOM) {
    'use strict';
    
    DOM.Buffer  = new BufferProto();
    
    function BufferProto() {
        var Storage = DOM.Storage,
            Dialog  = DOM.Dialog,
            Info    = DOM.CurrentInfo,
            
            COPY    = 'copy',
            CUT     = 'cut';
        
        function getNames() {
            var name    = Info.name,
                names   = DOM.getSelectedNames(),
                n       = names.length;
            
            return n ? names : [name];
        }
        
        this.copy   = function() {
            var Storage = DOM.Storage,
                names   = getNames(),
                from    = Info.dirPath;
            
            Storage.remove(CUT)
                .set(COPY, {
                    from : from,
                    names: names
                });
        };
        
        this.cut    = function() {
            var Storage = DOM.Storage,
                names   = getNames(),
                from    = Info.dirPath;
                
            Storage.remove(COPY)
                .set(CUT, {
                    from : from,
                    names: names
                });
        };
        
        this.paste  = function() {
            var copy    = Storage.get.bind(Storage, COPY),
                cut     = Storage.get.bind(Storage, CUT);
            
            Util.exec.parallel([copy, cut], function(error, cp, ct) {
                var data    = {},
                    msg     = 'Path is same!',
                    path    = Info.dirPath;
                
                if (!error && !cp && !ct)
                    error   = 'No files selected!';
                    
                if (error) {
                    DOM.Dialog.alert(error);
                } else if (cp) {
                    data        = Util.parseJSON(cp);
                    data.to     = path;
                    
                    if (data.from === path)
                        Dialog.alert(msg);
                    else
                        DOM.copyFiles(data);
                
                } else if (ct) {
                    data        = Util.parseJSON(ct);
                    data.to     = path;
                    
                    if (data.from === path)
                        Dialog.alert(msg);
                    else
                        DOM.moveFiles(data);
                }
                
                Storage.remove(COPY)
                    .remove(CUT);
            });
        };
    }
})(Util, DOM);