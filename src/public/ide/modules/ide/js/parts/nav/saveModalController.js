
ide.factory('saveProjectModal', ['btfModal',function (btfModal) {
    return btfModal({
        controller: 'SaveModalCtrl',
        controllerAs: 'modal',
        templateUrl: 'saveProject.html'
    });
}])
    .controller('SaveModalCtrl',['saveProjectModal',function (saveProjectModal) {
        this.closeMe=saveProjectModal.deactivate;
    }])
;