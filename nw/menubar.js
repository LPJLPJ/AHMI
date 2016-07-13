/**
 * Created by ChangeCheng on 16/7/12.
 */

;(function () {

    try {
        var os = require('os');
        var menuConfig = {
            file: {
                title: 'FILE',
                items: [
                    {
                        label: '关于',
                        icon: '',
                        type: 'normal',
                        click: function () {
                            toastr.info('haha');
                        },
                        key: 'a',
                        modifiers: 'ctrl'
                    },
                    {
                        label: 'Quit',
                        icon: '',
                        type: 'normal',
                        click: function () {
                            nw.App.quit();
                        },
                        key: 'q',
                        modifiers: 'ctrl'
                    }
                ]
            }
        }

        var menu = new nw.Menu({type: 'menubar'});

        for (var name in menuConfig) {
            var curSubmenu = new nw.Menu();
            var items =  menuConfig[name].items;
            for (var i = 0; i <items.length; i++) {
                curSubmenu.append(new nw.MenuItem(items[i]));
            }
            menu.append(new nw.MenuItem({
                label: menuConfig[name].title,
                submenu: curSubmenu
            }))

        }
        console.log(menu);

        nw.Window.get().menu = menu;
    } catch (e) {
        console.log(e);
    }
})();