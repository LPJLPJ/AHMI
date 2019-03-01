//3d draw engine
//created by Zzen1sS
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS

        module.exports = factory()
    } else {
        // Browser globals
        window.AdvancedDrawEngine = factory();
    }
}(function () {
    var AdvancedDrawEngine = {}

    //shared canvas to render
    var sharedCanvasDOM = null
    var sharedEngine = null
    var sharedScene = null
    AdvancedDrawEngine.getSharedCanvas = function(){
        if (sharedCanvasDOM){
            return sharedCanvasDOM
        }else{
            sharedCanvasDOM = document.createElement('canvas')
            document.body.appendChild(sharedCanvasDOM)
            return sharedCanvasDOM
        }
    }

    AdvancedDrawEngine.getSharedEngine = function(){
        if(!sharedEngine){
            sharedEngine = new BABYLON.Engine(AdvancedDrawEngine.getSharedCanvas(), true, { preserveDrawingBuffer: true, stencil: true });
        }
        return sharedEngine
    }

    AdvancedDrawEngine.getSharedScene = function(){
        if(sharedScene){
            return sharedScene
        }else{
            var scene = new BABYLON.Scene(AdvancedDrawEngine.getSharedEngine());
            scene.clearColor = new BABYLON.Color4(0,0,0,0);
            var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -2), scene);
            camera.setTarget(new BABYLON.Vector3(0, 0, 0));
            camera.fov = 0.927295218;
            //camera.attachControl(canvas, true);

            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
            light.intensity = 2;
            light.specular = new BABYLON.Color3(0,0,0);
            

            //plane to draw
            var plane = BABYLON.MeshBuilder.CreatePlane("plane",{width:1,height:1}, scene, true, BABYLON.Mesh.DOUBLESIDE)
            var textureGround = new BABYLON.DynamicTexture("dynamic texture", {width:200, height:200}, scene);   
            var textureContext = textureGround.getContext();
            
            var materialGround = new BABYLON.StandardMaterial("Mat", scene);    				
            materialGround.diffuseTexture = textureGround;
            materialGround.diffuseTexture.hasAlpha = true;
            materialGround.backFaceCulling = false;
            // materialGround.disableLighting = true
            // plane1.material = materialGround;
            plane.material = materialGround;
            sharedScene = {
                scene:scene,
                camera:camera,
                light:light,
                plane:plane,
                materialGround:materialGround,
                textureGround:textureGround
            }
            return sharedScene
        }
        
    }

    //drawHandler: draw canvas method in 2D
    //options: canvas info in 3D
    AdvancedDrawEngine.drawCanvasPerspective = function(drawHandler,options){
        var size = options.size || 100
        var cWidth = size
        var cHeidht = size
        

        var sharedCanvas = AdvancedDrawEngine.getSharedCanvas()
        sharedCanvas.width = cWidth
        sharedCanvas.height = cHeidht

        // var engine = new BABYLON.Engine(sharedCanvas, true, { preserveDrawingBuffer: true, stencil: true });
        var sceneObj = AdvancedDrawEngine.getSharedScene()
        
        var plane = sceneObj.plane
        window.plane = plane

        //position
        if(options.position){
            plane.position.x = (options.position.x/size) || 0
            plane.position.y = (options.position.y/size) || 0
            plane.position.z = (options.position.z/size) || 0
        }
       

        if(options.rotation){
            plane.rotation.x = options.rotation.x || 0
            plane.rotation.y = options.rotation.y || 0
            plane.rotation.z = options.rotation.z || 0
        }

        
        var m = new BABYLON.Matrix.Identity()
        if(options.shearZ){
            
            // m.m[8] = (options.shearZ) ||0
            m.m[2] = Math.tan((options.shearZ) ||0)
            // m.m[2] = Math.tan(89/90*Math.PI/2)
            // m.m[0] = (options.shearZ) ||0
            // console.log(m)
            
            
        }
        plane.setPivotMatrix(m,false)
       
        // console.log(new BABYLON.Matrix.Identity())

       
        //Create dynamic texture
        
        
        // plane3.material = materialGround;
        var textureGround = sceneObj.textureGround
        // textureGround.width = cWidth
        // textureGround.height = cHeidht
        textureGround.scaleTo(cWidth,cHeidht)
        var textureContext = sceneObj.textureGround.getContext()
        
        textureContext.save()
        drawHandler(textureContext)
        textureContext.restore()
        textureGround.update();
        sceneObj.scene.render();

        //BABYLON.Tools.CreateScreenshot(engine, camera, 200)

    }

    return AdvancedDrawEngine

}))