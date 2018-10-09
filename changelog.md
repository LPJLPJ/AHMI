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

1.9.2_test
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
fix:
    1. subcanvas action bug
    2. local ver save as bug
update:
    1. complete rebuild data structure and render canvas module.
    2. remove proJson and loadFromProJson operate
    3. compatible old local ver by generate compatible local project

1.10.1
add:
    1. work with shared project using socketIO
    2. visualization of project using D3
    3. user can choose project version in submenu
fix:
    1. names specification
update:
    1. choose version in right click
    2. when upload local project to web filter resources which generate by IDE

1.10.2
add:
    1. dateTime widget add font style of italic and bold
    2. save project as another and scale the resolution
    3. sort tag by name or register
fix:
    1. blog media bug fix
    2. animation bug  fix
update:
    1. new draw font logic

1.10.3
add:
    1. dashboard add no-background mode
    2. middleWareService to process project data
    3. alpha image
    4. add tag change
    5. 增加蒙板、开机动画批量插入、子图层复制粘贴、右下方图层菜单拖拽操作
    6. template Center
    7. SXIntro
    8. show estimateFileSize
    9. tag manage
    10. 帧率tag
    11. mask
    12. IDE multi version
    13. absolute position
   
fix:
    1. files can't compress
    2. tags bug
update:
    1. pointer of dashboard support rect image and not render in generate
    2. mv public/view to src/public src/view
    3. gulp file
    4. compress all html css js
    5. render page, render slieblock, remove pointer render


1.10.4
add:
fix:
    1. fix middleWareService bug
update:
    1. all compress

1.10.5
add:
    1. tag string support
    2. project category
    3. resources.html
    4. compatibility check
    5. download localIDE, sim_gen_all
    6. data-analysis
    7. action visualization
    8. physical pixel ratio simulation support
    9. num hexical display
    10. resource download
    11. multi-color progress with image
    12. template remove at admin page
   
fix:
    1. upload zip file bug
    2. timer count
    3. git ignore
    4. delete resources bug
    5. timerTag
    6. render page png bug
    7. render slide switch bug
    8. drag and drop validation bug
    9. download actionV graph bug
    10. cmd check bug
    11. tag type switch css bug
update:
    1. gulp dev watch
    2. local ide generate hash zip file
    3. add zip file validator
    4. newbie guide
    5. tagString default encoding:utf-8
    6. tag list chart
    7. render pure color pointer for dashboard
    8. gulp watch:modified
    9. action visualization: scale, collapse
    10. upload file.zip with md5 hash
    11. tag bit overlap detection, add timer quickly
    12. texture.acf size calculation
    13. widget list icon
    
1.10.6
add:
    1.support dynamic Animation config. Animation normal mode compatible with old version
update:
    1. update render font image，draw char from 46 of ASCII
    2. remove dashboard's simple mode
fix:
    1. progress cursor
    2. input color
    3. fontGeneratorService render text png from index of 45 (represent by minus symbol)
    4. 数字控件和图层数字符号模式下，模拟器运行显示错误
    5. 控件第一次使用自定义字体时渲染错误
    6. 增加删除变量时的占用检测条件