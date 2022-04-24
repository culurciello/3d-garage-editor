export class ConstructionBlock {

    constructor(level, 
                size = new BABYLON.Vector3(1, 1, 1), 
                position = new BABYLON.Vector3(0, 1, 0), 
                rotation = new BABYLON.Vector3(0, 0, 0), 
                color) {

        this.level = level;
        this.scene = level.scene;
        // this.actionManager = new BABYLON.ActionManager(this.scene);
        // this.advancedTexture = level.advancedTexture;

        this.parent = this.level.ground; // parenting to level ground by default
        this.mesh = null;
        this.size = size;
        this.position = position;
        this.rotation = rotation;
        this.color = color;

        this.destructible = false; // can be destroyed 
        this.destructive = false; // can destroy
        // this.visible ==> this.mesh.isVisible
        // this.solid ==> this.mesh.chechCollision and isPickable
        this.movable = false;

        // editable properties (used by graphical programming nodes):
        this.editableProperties = [this.destructible, this.destructive, this.visible, this.movable,
                                   this.solid, this.size, this.position, this.color,
                                  ];
    }

    create() {
        this.mesh = new BABYLON.Mesh.CreateBox('block', 2, this.level.scene);
        this.mesh.block = this;
        this.mesh.scaling = this.size;
        this.mesh.position = this.position;
        // this.mesh.rotation = this.rotation; // am not able to apply rotation here... not sure why
        // this.mesh.ellipsoid = this.size;
        this.mesh.setEnabled(true);
        this.mesh.isPickable = true;
        this.mesh.checkCollisions = true;

        var boxMaterial = new BABYLON.StandardMaterial('blockmat', this.level.scene);
        if (this.color) boxMaterial.emissiveColor = this.color;
        else { 
            boxMaterial.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
        }
        this.mesh.material = boxMaterial;
        this.color = this.mesh.material.emissiveColor; // update object color

        BABYLON.Tags.AddTagsTo(this.mesh, 'block');

        this._miniMenu = this.level.ui.miniMenu(this);
        this._editMenu = this.level.ui.editMenu(this);

        return this;
    }

    destroy() {
        console.log('destroyed!')
        if (this._miniMenu) this.level.ui.menuTexture.removeControl(this._miniMenu);
        if (this._editMenu) this.level.ui.menuTexture.removeControl(this._editMenu);
        this.level.interpolate(this.mesh.position, 'y', 0.5, 100 * this.mesh.position.y);
        this.remove();
    }

    remove() {
        if(!this.mesh) return;
        
        setTimeout(() => {
            this.mesh.dispose();
            this.mesh = null;
        }, 300);
    }
     
} // end class