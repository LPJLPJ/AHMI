v1.8.1
add:
    1. disable highlight for single widget
update:
fix:

v1.8.2
add:
    1. using sortable.js to sort resources
    2. multicolor progress mode
update:
    1. inputkeyboard supports highlight
fix:
    1. the attribute information of widget group and layer group bug 
    2. add page when you are editing in subCanvas bug

v1.8.3_test
add:
    1. CAN configure project for web IDE
update:
    1. the data structure of the trigger of a action is string
    2. error message appear when trigger not selected 
fix:

v1.8.4
add:
    1. dashboard animation
    2. fontMesureService
update:
    1. num bi-direction animation
fix:
    1. font privilege
    
v1.8.5_test
add:
    1. export local project from web
    2. CAN configure project for NW
update:
    1. CAN date structure
    2. new draw datetime widget method
    3. new draw num widget method
fix:

v1.8.5
add:
update:
    1. keep pace with v1.8.5_test
fix:

v1.8.6_test
add:
    1. support update local IDE
update:
    1. simulator now draw synchronously
fix:
    

v1.8.7
add:
    1. blog service
update:
    1. video widget
fix:

v1.8.8
add:
    1. remove duplicated files for rendering
    2. pagination for blog
    3. update for local ide
update:
    1. update blog category
fix:

v1.8.9
add:
    1. admin can release new local version in manage space
    2. add download link to download local version
    3. IDE support save project as XX in web
update:
    1. new IDE manage space
fix:
    1. fix a bug that versionTag didn't display in page
    2. fix a bug that delete a project that mongodb cause server crash
    
v1.9.0
add:
    1. support drag and drop local pro folder to add it to web server 
update:
fix:
    1.fix a bug that cause upload a folder who is a download local project fail
    2.fix a bug that only can upload max 100 files
    3.fix a bug in generate

v1.9.1
add:
   1. add local IDE user type update fun
   2. add blog comment  fun
update:
   1. hide progress script mode
   2. update login form logic
   3. Open blog portal
   4. hide CAN
   5. hide rotate button in nav and forbidden to change timer tag name
   6. hide animation when it is widget
fix:
   1.fix a bug that change a project's attr will empty this project in local version
   2.fix a bug that rotate widget
   3.fix a bug that use key to move widget group
   4.fix src problem when use template mode
   
2017.5.3 
fix:
    1. blank command bug
    2. page's tag is null when open a project
    3. undo's bug when delete a page
    4. change num widget's numModeId to enableAnimation
    5. copy page in sublayer mode will cause cannot find subLayers
    6. alarms in simulator
add:
    1. MyAnimation rendering
    2. tag's register limit
    3. anmiation's duration time limit
    4. project's name limit when saveas
    5. limit duration time to 5000


2017.5.15
fix:
    1. copy page bug
    2. mulitiColor progress's cursor not display in simulator
    3. remove Slide and Switch widget's action
    4. change some anmiation logic
    5. num has decimal in simulator bug
    6. remove textarea widget's scale ctrl
    7. widget in default template imgSrc bug
add:
    1. add change subLayer zIndex fun