const loader = setInterval(() => {
    if (document.querySelector('.canvas')) {

        const canvas = document.querySelector('.canvas')
        const engine = new BABYLON.Engine(canvas, true);
        window.addEventListener('resize', () => engine.resize());
        const scene = createSceneLightGravity();
        const orb = makeOrb();
        const camera = makeCamera()

        function createSceneLightGravity() {
            const scene = new BABYLON.Scene(engine);
            //babylon's physics
            // scene.enableGravity = new BABYLON.Vector3(0, -9.81, 0);
            scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

            const light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);

            //Ground
            const ground = BABYLON.Mesh.CreateBox("ground", 200, scene);
            ground.position = new BABYLON.Vector3(0, 0, 0);
            ground.scaling.y = 0.01;

            // ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
            //cannon
            ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0,
                restitution: 0
            }, scene);

            //boxes. This should be a function.
            const box = BABYLON.Mesh.CreateBox("box", 1, scene);
            box.position = new BABYLON.Vector3(5, 1, -10);
            box.actionManager = new BABYLON.ActionManager(scene);
            const action = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, box, "visibility", 0.2, 1000);
            box.actionManager.registerAction(action)

            box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0,
                restitution: 0
            }, scene);

            //Wall
            const wall = BABYLON.Mesh.CreateBox("wall", 20, scene, false, BABYLON.Mesh.FRONTSIDE);
            wall.position.y = 10
            wall.position.z = 100
            wall.scaling.x = 10
            wall.scaling.y = 3
            wall.scaling.z = .1
            wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0,
                restitution: 0
            }, scene);

            //Collisions
            scene.collisionsEnabled = true;
            // ground.checkCollisions = true;
            // box.checkCollisions = true;
            // wall.checkCollisions = true;

            return scene;
        }

        function makeCamera() {
            const camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2, -20), scene);
            camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
            // camera.applyGravity = true;
            camera.checkCollisions = true;

            camera.attachControl(canvas, true);
            camera.physicsImpostor = new BABYLON.PhysicsImpostor(camera, BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 1000,
                restitution: 0
            }, scene);
            return camera
        }

        function jumpCamera(camera) {
            if (camera.jump)
                camera.position.y += 1;
        }

        BABYLON.Tools.RegisterTopRootEvents([
            {
                name: "keydown",
                handler: onKeyDown
            }, {
                name: "keyup",
                handler: onKeyUp
            }
        ]);

        function onKeyDown(event) {
            if (event.keyCode === 32)
                camera.jump = true
        }

        function onKeyUp(event) {
            if (event.keyCode === 32)
                camera.jump = false;
            }

        function makeOrb() {
            const orb = BABYLON.Mesh.CreateSphere('orb', 10, 3, scene);
            orb.position = new BABYLON.Vector3(0, 5, 0);
            orb.velocity = {}
            orb.velocity.z = .2;
            orb.velocity.y = .2;
            orb.velocity.x = .2;

            orb.actionManager = new BABYLON.ActionManager(scene);
            const action = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, orb, "visibility", 0.2, 1000);
            orb.actionManager.registerAction(action)

            return orb
        }

        function moveOrb() {
            orb.position.z += orb.velocity.z
            orb.position.y += orb.velocity.y
            orb.position.x += orb.velocity.x
            if (orb.position.z >= 75 || orb.position.z <= -75)
                orb.velocity.z = -orb.velocity.z
            if (orb.position.y >= 15 || orb.position.y <= 0)
                orb.velocity.y = -orb.velocity.y
            if (orb.position.x >= 75 || orb.position.x <= -75)
                orb.velocity.x = -orb.velocity.x
        }

        engine.runRenderLoop(() => {
            scene.render();
            moveOrb(orb);
            jumpCamera(camera);
        });
        clearInterval(loader)

    }
}, 100)
