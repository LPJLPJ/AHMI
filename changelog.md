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
update:
    1. add view port to display info in simulator
add:
    1. add change subLayer zIndex fun
    2. now can delete multi-files at once
    3. can upload a zip which is generated in IDE to rebuild a project

1.9.2
fix:
    1. delete the first subcanvas in canvas bug
    2. num widget in animation model cannot trigger high/low alarm
update:
    1. only show timer when opertion is setTimer***
    2. remove button's tag
    3. in  action value can only input integer
update:
    1. optimization upload a zip


1.9.3
add:
    1. support switch and slide widget render text
fix:
    1. fix a bug that newly created project with templates can not be opend
    2. fix a bug about tag's display in action
    3. simulator reg input -1 but display nan
    4. actions' op can't display in a saved project
    5. num widget max val ue
update:
    1. x,y,range from -2000 to 2000.width,height range from 1 to 2000

1.9.4
add:
    1. last save uuid and last save timestamp
fix:
    1. page animation will not show background during animation
update:

1.9.5
add:
    1. add texNum widget
fix:
    1. animation bug fix
    2. fix redo/undo in some mode
    3. fix css in select and widget dropdown
    4. fix old switch render bug
update:
    1. slide widget can insert slice in middle
    2. add resource select all

1.9.6
add:
    1.add local save as option
    2.add select all function
    3.add ttf symbol when upload ttf
fix:
    1.resource upload bugs
    2.gulp bug to cause undefined text in old switch tex after render
    3.simulator bug high alarm 0 to 1

1.9.7
add:
    1. alert err
fix:

1.9.8
add:
    1. dynamically change ide title to project name
    2. add move to front and move to back in sort widgets and layers and sublayers
fix:
    1. canvas and canvas group copy bug caused by $$hashkey
    2. when page backgroundImage is empty use null rather than blank.png
update:
    1. change index title and description
    2. a tag cannot rename when it bind to a widget or page or canvas
    3. a local update to web will rewrite its createTime and lastModifiedTime,projects will sort by createTime
    4. in personal projects space when pointer hover on a project ,will show its createTime and lastModifiedTime
    5. local IDE will check update auto when it is setup

1.10.0
add:
    1. share project
fix:
    1. subcanvas action bug
    2. local ver save as bug
update:
    1. complete rebuild data structure and render canvas module.
    2. remove proJson and loadFromProJson operate
    3. compatible old local ver by generate compatible local project

1.10.0
add:
    1. work with shared project using socketIO
    2. visualization of project using D3
fix:
    1. names specification
update:
    1. choose version in right click

1.10.1
add:
    1. work with shared project using socketIO
    2. visualization of project using D3
fix:
    1. names specification
update:
    1. choose version in right click
