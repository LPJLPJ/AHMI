/**
 * Created by shenaolin on 16/2/28.
 */

angular.module('GlobalModule',[])
    .service('GlobalService', ['TemplateProvider','Type',function (TemplateProvider,Type) {

        var exampleProject={
            initSize:{
                width:500,
                height:400,
            },
            currentSize:{
                width:500,
                height:400,
            },
            resourceList:[],

            pages:[{
                url: '',
                id: Math.random().toString(36).substr(2),
                // proJsonStr:  '{"objects":[],"background":"rgba(' + 255 + ',' + 255 + ',' + 255 + ',1.0)"}',
                layers: [],
                name: 'NewPage',
                type: 'MyPage',
                mode:0, //0:编辑Page  1:编辑SubLayer
                expand:true,
                selected:false,
                current:false,
                backgroundColor:'rgba(' + 255 + ',' + 255 + ',' + 255 + ',1.0)',
                backgroundImage:'',
                currentFabLayer:null,
            }]
        }

        this.getBlankProject= function () {
            var firstPage=TemplateProvider.getRandomPage();
            firstPage.current=true;
            var project={
                initSize:{
                    width:500,
                    height:400,
                },
                currentSize:{
                    width:500,
                    height:400,
                },
                resourceList:[],
                customTags:[],
                timerTags:[],
                timers:0,

                pages:[firstPage]


            };
            return project;

        };





    }])
    .service('Utils', function () {
        this.getRandomId= function () {
            return Math.random().toString(36).substr(2);
        }
    })
;