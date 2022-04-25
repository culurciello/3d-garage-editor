// WCD

// utility functions

export function generateRandomPosition() 
{
    var minX = -4.0; var maxX = 4.0;
    var minZ = -4.0; var maxZ = 4.0;
    var startY = 0.1;
    return new BABYLON.Vector3(getRandomFloat(minX, maxX), startY, getRandomFloat(minZ, maxZ));
}

export function getRandomFloat(min, max) 
{
    return Math.random() * (max - min) + min;
}

export function addLabel(uiTexture, labelText, mesh)
{
    return; //disable labels for now
    var label = new BABYLON.GUI.InputText();
    label.width = "40px";
    label.height = "20px";
    label.color = "black";
    label.autoStretchWidth = true;
    label.background = "white";
    label.thickness = 0;
    label.alpha = 0.7;
    label.text = labelText;
    uiTexture.addControl(label);
    label.linkWithMesh(mesh);   
    label.linkOffsetY = -50;
    label.onTextChangedObservable.add(function() {
        mesh.name = label.text;
        mesh.id = label.text;
    })

    var target = new BABYLON.GUI.Ellipse();
    target.width = "10px";
    target.height = "10px";
    target.color = "Orange";
    target.thickness = 2;
    target.background = "green";
    uiTexture.addControl(target);
    target.linkWithMesh(mesh);   

    var line = new BABYLON.GUI.Line();
    line.lineWidth = 2;
    line.color = "Orange";
    line.y2 = 10;
    line.linkOffsetY = -5;
    uiTexture.addControl(line);
    line.linkWithMesh(mesh); 
    line.connectedControl = label;     
}

export function RenderToImage(scene, w, h) {
    BABYLON.Tools.CreateScreenshotUsingRenderTarget(
                scene.getEngine(),
                scene.activeCamera,
                { width: w, height: h },
                undefined,
                'image/png',
                8,
                false,
                'screenshot.png'
            );
}
