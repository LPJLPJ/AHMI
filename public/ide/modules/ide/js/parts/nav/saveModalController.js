/**
 * Created by 沈奥林 on 2016/5/5.
 */
ide.factory('saveProjectModal', function (btfModal) {
    return btfModal({
        controller: 'SaveModalCtrl',
        controllerAs: 'modal',
        templateUrl: 'saveProject.html'
    });
})
    .controller('SaveModalCtrl',function (saveProjectModal) {
        this.closeMe=saveProjectModal.deactivate;
    })
;