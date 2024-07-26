/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
// 22FI092 飛知和結



class ThreeJSContainer {
    scene;
    light;
    world;
    ballBody;
    ballMesh;
    humanMesh;
    humanBody;
    netBodies = [];
    goalElement; // ゴール表示用の要素
    particleSystem;
    constructor() {
        this.createGoalElement();
    }
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x495ed));
        renderer.shadowMap.enabled = true;
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -9.82, 0) });
        this.world.defaultContactMaterial.restitution = 0.8; // 摩擦
        this.world.defaultContactMaterial.friction = 0.03; // 反発係数
        this.createSoccerGoal();
        this.createHuman();
        this.createBall();
        const phongMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0x90ee90 });
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(25, 25);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide;
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        this.world.addBody(planeBody);
        const gridHelper = new three__WEBPACK_IMPORTED_MODULE_1__.GridHelper(10);
        this.scene.add(gridHelper);
        const axesHelper = new three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper(5);
        this.scene.add(axesHelper);
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        let update = () => {
            this.world.fixedStep();
            this.ballMesh.position.copy(this.ballBody.position);
            this.ballMesh.quaternion.copy(this.ballBody.quaternion);
            // 人間モデルのメッシュと物理ボディを同期
            if (this.humanMesh && this.humanBody) {
                this.humanMesh.position.copy(this.humanBody.position);
                this.humanMesh.quaternion.copy(this.humanBody.quaternion);
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
    createParticleSystem = () => {
        const particleCount = 500;
        const positions = new Float32Array(particleCount * 3); // 3次元座標 (x, y, z) を格納
        const colors = new Float32Array(particleCount * 3); // RGBカラー (r, g, b) を格納
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = Math.random() * 20 - 10; // X座標
            positions[i * 3 + 1] = Math.random() * 20 - 10; // Y座標
            positions[i * 3 + 2] = Math.random() * 20 - 10; // Z座標
            // ランダムな色を設定
            colors[i * 3] = Math.random(); // R
            colors[i * 3 + 1] = Math.random(); // G
            colors[i * 3 + 2] = Math.random(); // B
        }
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry();
        geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(colors, 3)); // 色属性を追加
        const particleMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.7
        });
        this.particleSystem = new three__WEBPACK_IMPORTED_MODULE_1__.Points(geometry, particleMaterial);
        this.scene.add(this.particleSystem);
    };
    createGoalElement = () => {
        this.goalElement = document.createElement("div");
        this.goalElement.style.position = "absolute";
        this.goalElement.style.top = "20px";
        this.goalElement.style.left = "50%";
        this.goalElement.style.transform = "translateX(-50%)";
        this.goalElement.style.padding = "10px 20px";
        this.goalElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        this.goalElement.style.color = "#ffffff";
        this.goalElement.style.fontSize = "24px";
        this.goalElement.style.fontWeight = "bold";
        this.goalElement.style.borderRadius = "10px";
        this.goalElement.style.display = "none"; // 初期状態では非表示
        this.goalElement.innerText = "ゴール!";
        document.body.appendChild(this.goalElement);
    };
    handleCollision = (event) => {
        if (this.netBodies.includes(event.body)) {
            this.ballBody.velocity.set(0, 0, 0);
            this.ballBody.angularVelocity.set(0, 0, 0);
            this.displayGoal();
        }
    };
    displayGoal = () => {
        this.goalElement.style.display = "block";
        if (!this.particleSystem) {
            this.createParticleSystem(); // パーティクルシステムを作成
        }
        this.particleSystem.visible = true; // パーティクルシステムを表示
        setTimeout(() => {
            this.goalElement.style.display = "none";
            if (this.particleSystem) {
                this.scene.remove(this.particleSystem); // パーティクルシステムをシーンから削除
                // Geometryのメモリ解放
                this.particleSystem.geometry.dispose();
                // Materialの参照を解除
                this.particleSystem.material = null;
                this.particleSystem = null; // パーティクルシステムの参照を削除
            }
        }, 2000); // 2秒後に非表示
    };
    createSoccerGoal = () => {
        const goalWidth = 7.32;
        const goalHeight = 2.44;
        const goalDepth = 2;
        const postMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0xffffff });
        const createPost = (width, height, depth, position) => {
            const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(width, height, depth);
            const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, postMaterial);
            mesh.position.copy(position);
            this.scene.add(mesh);
            const shape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(width / 2, height / 2, depth / 2));
            const body = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
            body.addShape(shape);
            body.position.set(position.x, position.y, position.z);
            this.world.addBody(body);
        };
        createPost(0.1, goalHeight, 0.1, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-goalWidth / 2, goalHeight / 2, 0)); // 左前ポスト
        createPost(0.1, goalHeight, 0.1, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(goalWidth / 2, goalHeight / 2, 0)); // 右前ポスト
        createPost(goalWidth, 0.1, 0.1, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, goalHeight, 0)); // 前クロスバー
        createPost(0.1, goalHeight, 0.1, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-goalWidth / 2, goalHeight / 2, -goalDepth)); // 左後ろポスト
        createPost(0.1, goalHeight, 0.1, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(goalWidth / 2, goalHeight / 2, -goalDepth)); // 右後ろポスト
        createPost(goalWidth, 0.1, 0.1, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, goalHeight, -goalDepth)); // 後ろクロスバー
        createPost(0.1, 0.1, goalDepth, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-goalWidth / 2, goalHeight, -goalDepth / 2)); // 左上バー
        createPost(0.1, 0.1, goalDepth, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(goalWidth / 2, goalHeight, -goalDepth / 2)); // 右上バー
        createPost(0.1, 0.1, goalDepth, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-goalWidth / 2, 0, -goalDepth / 2)); // 左地面バー
        createPost(0.1, 0.1, goalDepth, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(goalWidth / 2, 0, -goalDepth / 2)); // 右地面バー
        createPost(goalWidth, 0.1, 0.1, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, -goalDepth)); // 後ろ地面バー
        this.createNet(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, goalHeight / 2, -goalDepth), goalWidth, goalHeight); // 後ろネット
        this.createNet(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-goalWidth / 2, goalHeight / 2, -goalDepth / 2), goalDepth, goalHeight, true); // 左ネット
        this.createNet(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(goalWidth / 2, goalHeight / 2, -goalDepth / 2), goalDepth, goalHeight, true); // 右ネット
        this.createNet(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, goalHeight, -goalDepth / 2), goalWidth, goalDepth, false, true); // 上部ネット
    };
    createNet = (position, width, height, rotateY = false, rotateX = false) => {
        const netMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0xffffff, wireframe: true });
        const netSegments = 10;
        const netGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(width, height, netSegments, netSegments);
        const netMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(netGeometry, netMaterial);
        netMesh.position.copy(position);
        if (rotateY) {
            netMesh.rotateY(Math.PI / 2);
        }
        if (rotateX) {
            netMesh.rotateX(Math.PI / 2);
        }
        this.scene.add(netMesh);
        // CANNON.jsの物理ボディの作成
        const netShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(width / 2, height / 2, 0.1)); // 0.1の厚みを持たせる
        const netBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 }); // ネットは固定されているため質量は0
        netBody.addShape(netShape);
        netBody.position.copy(position);
        if (rotateY) {
            netBody.quaternion.setFromAxisAngle(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, 1, 0), Math.PI / 2);
        }
        if (rotateX) {
            netBody.quaternion.setFromAxisAngle(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(1, 0, 0), Math.PI / 2);
        }
        this.world.addBody(netBody);
        this.netBodies.push(netBody); // ネットのボディをリストに追加
    };
    createHuman = () => {
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(1, 2, 0.5);
        const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0x888888 });
        this.humanMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
        this.humanMesh.position.set(0, 1, 0.5);
        this.scene.add(this.humanMesh);
        const shape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0.5, 1, 0.25)); // 正しい寸法
        this.humanBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 80 });
        this.humanBody.addShape(shape);
        this.humanBody.position.set(0, 1, 0.5);
        this.world.addBody(this.humanBody);
    };
    moveHumanTo = (position) => {
        this.humanBody.position.copy(position);
        this.humanBody.velocity.set(0, 0, 0); // 速度をリセット
        this.humanBody.angularVelocity.set(0, 0, 0); // 角速度をリセット
        this.humanBody.quaternion.set(0, 0, 0, 1); // 回転をリセット
        // メッシュも同様にリセットする
        this.humanMesh.position.copy(this.humanBody.position);
        this.humanMesh.quaternion.copy(this.humanBody.quaternion);
    };
    syncMeshWithBody = (mesh, body) => {
        const update = (time) => {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
    createBall = () => {
        const ballRadius = 0.5;
        const ballShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Sphere(ballRadius);
        this.ballBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 1 });
        this.ballBody.addShape(ballShape);
        this.ballBody.position.set(0, ballRadius, 5);
        this.world.addBody(this.ballBody);
        const ballGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(ballRadius, 32, 32);
        const ballMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0x0000ff });
        this.ballMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(ballGeometry, ballMaterial);
        this.scene.add(this.ballMesh);
        this.ballBody.addEventListener('collide', this.handleCollision);
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    };
    resetBallPosition = () => {
        this.ballBody.position.set(0, 0.5, 5); // 初期位置にリセット
        this.ballBody.velocity.set(0, 0, 0); // 速度をゼロにリセット
        this.ballBody.angularVelocity.set(0, 0, 0); // 角速度をゼロにリセット
    };
    handleKeyDown = (event) => {
        const impulse = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3();
        const worldPoint = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(this.ballBody.position.x, this.ballBody.position.y, this.ballBody.position.z);
        switch (event.key) {
            case 'ArrowUp':
                impulse.set(0, 0, -10); // 前に飛ばす
                this.ballBody.applyImpulse(impulse, worldPoint);
                break;
            case 'ArrowDown':
                impulse.set(0, 5, -10); // 斜め上に飛ばす
                this.ballBody.applyImpulse(impulse, worldPoint);
                break;
            case 'ArrowLeft':
                impulse.set(-3.5, 0, -9); // 左に飛ばす
                this.ballBody.applyImpulse(impulse, worldPoint);
                break;
            case 'ArrowRight':
                impulse.set(3.5, 0, -9); // 右に飛ばす
                this.ballBody.applyImpulse(impulse, worldPoint);
                break;
            case ' ': // スペースキーでボールを元の位置にリセット
                this.resetBallPosition();
                break;
            case 's': // 's' キーで人を真ん中に動かす
                this.moveHumanTo(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, 1, 0.5));
                break;
            case 'r': // 'r' キーで人を右に動かす
                this.moveHumanTo(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(2, 1, 0.5)); // 右の位置に変更
                break;
            case 'l': // 'l' キーで人を左に動かす
                this.moveHumanTo(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(-2, 1, 0.5)); // 左の位置に変更
                break;
        }
    };
    handleKeyUp = (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.ballBody.velocity.set(0, 0, 0);
                break;
        }
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(5, 5, 5));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksMENBQWEsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQzFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLDBDQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDekcsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksMENBQWEsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVU7UUFDekYsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksMENBQWEsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO1FBQ3ZHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLDBDQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87UUFDdEcsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksMENBQWEsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO1FBQy9GLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLDBDQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7UUFDOUYsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksMENBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFFL0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLDBDQUFhLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRO1FBQ2pHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSwwQ0FBYSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPO1FBQ3ZILElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSwwQ0FBYSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTztRQUN0SCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksMENBQWEsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUTtJQUNqSCxDQUFDO0lBRU8sU0FBUyxHQUFHLENBQUMsUUFBdUIsRUFBRSxLQUFhLEVBQUUsTUFBYyxFQUFFLFVBQW1CLEtBQUssRUFBRSxVQUFtQixLQUFLLEVBQUUsRUFBRTtRQUMvSCxNQUFNLFdBQVcsR0FBRyxJQUFJLG9EQUF1QixDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN0RixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdkIsTUFBTSxXQUFXLEdBQUcsSUFBSSxnREFBbUIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVyRixNQUFNLE9BQU8sR0FBRyxJQUFJLHVDQUFVLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWhDLElBQUksT0FBTyxFQUFFO1lBQ1QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsSUFBSSxPQUFPLEVBQUU7WUFDVCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDaEM7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4QixxQkFBcUI7UUFDckIsTUFBTSxRQUFRLEdBQUcsSUFBSSwwQ0FBVSxDQUFDLElBQUksMkNBQVcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWM7UUFDNUYsTUFBTSxPQUFPLEdBQUcsSUFBSSwyQ0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxvQkFBb0I7UUFDbEUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFrQyxDQUFDLENBQUM7UUFFMUQsSUFBSSxPQUFPLEVBQUU7WUFDVCxPQUFPLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksMkNBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDOUU7UUFDRCxJQUFJLE9BQU8sRUFBRTtZQUNULE9BQU8sQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSwyQ0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUM5RTtRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsaUJBQWlCO0lBQ25ELENBQUM7SUFHTyxXQUFXLEdBQUcsR0FBRyxFQUFFO1FBQ3ZCLE1BQU0sUUFBUSxHQUFHLElBQUksOENBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBRyxJQUFJLG9EQUF1QixDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHVDQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUvQixNQUFNLEtBQUssR0FBRyxJQUFJLDBDQUFVLENBQUMsSUFBSSwyQ0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7UUFDckUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLDJDQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVPLFdBQVcsR0FBRyxDQUFDLFFBQXFCLEVBQUUsRUFBRTtRQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVO1FBQ2hELElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVztRQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVO1FBRXJELGlCQUFpQjtRQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFvQyxDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBeUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFFTyxnQkFBZ0IsR0FBRyxDQUFDLElBQWdCLEVBQUUsSUFBaUIsRUFBRSxFQUFFO1FBQy9ELE1BQU0sTUFBTSxHQUF5QixDQUFDLElBQUksRUFBRSxFQUFFO1lBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFvQyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQXlDLENBQUMsQ0FBQztZQUNyRSxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVPLFVBQVUsR0FBRyxHQUFHLEVBQUU7UUFDdEIsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLE1BQU0sU0FBUyxHQUFHLElBQUksNkNBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksMkNBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVsQyxNQUFNLFlBQVksR0FBRyxJQUFJLGlEQUFvQixDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEUsTUFBTSxZQUFZLEdBQUcsSUFBSSxvREFBdUIsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRWhFLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTyxpQkFBaUIsR0FBRyxHQUFHLEVBQUU7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYTtRQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWM7SUFDOUQsQ0FBQztJQUVPLGFBQWEsR0FBRyxDQUFDLEtBQW9CLEVBQUUsRUFBRTtRQUM3QyxNQUFNLE9BQU8sR0FBRyxJQUFJLDJDQUFXLEVBQUUsQ0FBQztRQUNsQyxNQUFNLFVBQVUsR0FBRyxJQUFJLDJDQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqSCxRQUFRLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDZixLQUFLLFNBQVM7Z0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO2dCQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ2hELE1BQU07WUFDVixLQUFLLFdBQVc7Z0JBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVO2dCQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ2hELE1BQU07WUFDVixLQUFLLFdBQVc7Z0JBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7Z0JBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDaEQsTUFBTTtZQUNWLEtBQUssWUFBWTtnQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7Z0JBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDaEQsTUFBTTtZQUNWLEtBQUssR0FBRyxFQUFFLHVCQUF1QjtnQkFDN0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3pCLE1BQU07WUFDVixLQUFLLEdBQUcsRUFBRSxtQkFBbUI7Z0JBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSwyQ0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsTUFBTTtZQUNWLEtBQUssR0FBRyxFQUFFLGlCQUFpQjtnQkFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLDJDQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVTtnQkFDeEQsTUFBTTtZQUNWLEtBQUssR0FBRyxFQUFFLGlCQUFpQjtnQkFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLDJDQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVO2dCQUN6RCxNQUFNO1NBQ2I7SUFDTCxDQUFDO0lBRU8sV0FBVyxHQUFHLENBQUMsS0FBb0IsRUFBRSxFQUFFO1FBQzNDLFFBQVEsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNmLEtBQUssU0FBUyxDQUFDO1lBQ2YsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxZQUFZO2dCQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxNQUFNO1NBQ2I7SUFDTCxDQUFDO0NBQ0o7QUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFbEQsU0FBUyxJQUFJO0lBQ1QsSUFBSSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3ZDLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksMENBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakYsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEMsQ0FBQzs7Ozs7OztVQ3pXRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyAyMkZJMDkyIOmjm+efpeWSjOe1kFxyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcclxuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xyXG5pbXBvcnQgKiBhcyBDQU5OT04gZnJvbSAnY2Fubm9uLWVzJztcclxuXHJcbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xyXG4gICAgcHJpdmF0ZSBzY2VuZTogVEhSRUUuU2NlbmU7XHJcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcclxuICAgIHByaXZhdGUgd29ybGQ6IENBTk5PTi5Xb3JsZDtcclxuICAgIHByaXZhdGUgYmFsbEJvZHk6IENBTk5PTi5Cb2R5O1xyXG4gICAgcHJpdmF0ZSBiYWxsTWVzaDogVEhSRUUuTWVzaDtcclxuICAgIHByaXZhdGUgaHVtYW5NZXNoOiBUSFJFRS5NZXNoO1xyXG4gICAgcHJpdmF0ZSBodW1hbkJvZHk6IENBTk5PTi5Cb2R5O1xyXG4gICAgcHJpdmF0ZSBuZXRCb2RpZXM6IENBTk5PTi5Cb2R5W10gPSBbXTtcclxuICAgIHByaXZhdGUgZ29hbEVsZW1lbnQ6IEhUTUxFbGVtZW50OyAvLyDjgrTjg7zjg6vooajnpLrnlKjjga7opoHntKBcclxuICAgIHByaXZhdGUgcGFydGljbGVTeXN0ZW06IFRIUkVFLlBvaW50cztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZUdvYWxFbGVtZW50KCk7XHJcbiAgICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xyXG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg0OTVlZCkpO1xyXG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcclxuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xyXG4gICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xyXG5cclxuICAgICAgICBjb25zdCBvcmJpdENvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xyXG5cclxuICAgICAgICBjb25zdCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcclxuICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcclxuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcclxuXHJcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xyXG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XHJcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBDQU5OT04uV29ybGQoeyBncmF2aXR5OiBuZXcgQ0FOTk9OLlZlYzMoMCwgLTkuODIsIDApIH0pO1xyXG5cclxuICAgICAgICB0aGlzLndvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwucmVzdGl0dXRpb24gPSAwLjg7IC8vIOaRqeaTplxyXG4gICAgICAgIHRoaXMud29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuMDM7IC8vIOWPjeeZuuS/guaVsFxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVNvY2NlckdvYWwoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUh1bWFuKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVCYWxsKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBob25nTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHg5MGVlOTAgfSk7XHJcbiAgICAgICAgY29uc3QgcGxhbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDI1LCAyNSk7XHJcbiAgICAgICAgY29uc3QgcGxhbmVNZXNoID0gbmV3IFRIUkVFLk1lc2gocGxhbmVHZW9tZXRyeSwgcGhvbmdNYXRlcmlhbCk7XHJcbiAgICAgICAgcGxhbmVNZXNoLm1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlO1xyXG4gICAgICAgIHBsYW5lTWVzaC5yb3RhdGVYKC1NYXRoLlBJIC8gMik7XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHBsYW5lTWVzaCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYW5lU2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XHJcbiAgICAgICAgY29uc3QgcGxhbmVCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcclxuICAgICAgICBwbGFuZUJvZHkuYWRkU2hhcGUocGxhbmVTaGFwZSk7XHJcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldChwbGFuZU1lc2gucG9zaXRpb24ueCwgcGxhbmVNZXNoLnBvc2l0aW9uLnksIHBsYW5lTWVzaC5wb3NpdGlvbi56KTtcclxuICAgICAgICBwbGFuZUJvZHkucXVhdGVybmlvbi5zZXQocGxhbmVNZXNoLnF1YXRlcm5pb24ueCwgcGxhbmVNZXNoLnF1YXRlcm5pb24ueSwgcGxhbmVNZXNoLnF1YXRlcm5pb24ueiwgcGxhbmVNZXNoLnF1YXRlcm5pb24udyk7XHJcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHBsYW5lQm9keSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdyaWRIZWxwZXIgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcigxMCk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZ3JpZEhlbHBlcik7XHJcblxyXG4gICAgICAgIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhlc0hlbHBlcig1KTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChheGVzSGVscGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcclxuICAgICAgICBjb25zdCBsdmVjID0gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQobHZlYy54LCBsdmVjLnksIGx2ZWMueik7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XHJcblxyXG4gICAgICAgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLndvcmxkLmZpeGVkU3RlcCgpO1xyXG4gICAgICAgICAgICB0aGlzLmJhbGxNZXNoLnBvc2l0aW9uLmNvcHkodGhpcy5iYWxsQm9keS5wb3NpdGlvbiBhcyB1bmtub3duIGFzIFRIUkVFLlZlY3RvcjMpO1xyXG4gICAgICAgICAgICB0aGlzLmJhbGxNZXNoLnF1YXRlcm5pb24uY29weSh0aGlzLmJhbGxCb2R5LnF1YXRlcm5pb24gYXMgdW5rbm93biBhcyBUSFJFRS5RdWF0ZXJuaW9uKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOS6uumWk+ODouODh+ODq+OBruODoeODg+OCt+ODpeOBqOeJqeeQhuODnOODh+OCo+OCkuWQjOacn1xyXG4gICAgICAgIGlmICh0aGlzLmh1bWFuTWVzaCAmJiB0aGlzLmh1bWFuQm9keSkge1xyXG4gICAgICAgICAgICB0aGlzLmh1bWFuTWVzaC5wb3NpdGlvbi5jb3B5KHRoaXMuaHVtYW5Cb2R5LnBvc2l0aW9uIGFzIHVua25vd24gYXMgVEhSRUUuVmVjdG9yMyk7XHJcbiAgICAgICAgICAgIHRoaXMuaHVtYW5NZXNoLnF1YXRlcm5pb24uY29weSh0aGlzLmh1bWFuQm9keS5xdWF0ZXJuaW9uIGFzIHVua25vd24gYXMgVEhSRUUuUXVhdGVybmlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQYXJ0aWNsZVN5c3RlbSA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJ0aWNsZUNvdW50ID0gNTAwO1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkocGFydGljbGVDb3VudCAqIDMpOyAvLyAz5qyh5YWD5bqn5qiZICh4LCB5LCB6KSDjgpLmoLzntI1cclxuICAgICAgICBjb25zdCBjb2xvcnMgPSBuZXcgRmxvYXQzMkFycmF5KHBhcnRpY2xlQ291bnQgKiAzKTsgLy8gUkdC44Kr44Op44O8IChyLCBnLCBiKSDjgpLmoLzntI1cclxuICAgIFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGljbGVDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpICogM10gPSBNYXRoLnJhbmRvbSgpICogMjAgLSAxMDsgLy8gWOW6p+aomVxyXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSAqIDMgKyAxXSA9IE1hdGgucmFuZG9tKCkgKiAyMCAtIDEwOyAvLyBZ5bqn5qiZXHJcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpICogMyArIDJdID0gTWF0aC5yYW5kb20oKSAqIDIwIC0gMTA7IC8vIFrluqfmqJlcclxuXHJcbiAgICAgICAgICAgIC8vIOODqeODs+ODgOODoOOBquiJsuOCkuioreWumlxyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDNdID0gTWF0aC5yYW5kb20oKTsgLy8gUlxyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDMgKyAxXSA9IE1hdGgucmFuZG9tKCk7IC8vIEdcclxuICAgICAgICAgICAgY29sb3JzW2kgKiAzICsgMl0gPSBNYXRoLnJhbmRvbSgpOyAvLyBCXHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcclxuICAgICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShwb3NpdGlvbnMsIDMpKTtcclxuICAgICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoJ2NvbG9yJywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShjb2xvcnMsIDMpKTsgLy8g6Imy5bGe5oCn44KS6L+95YqgXHJcbiAgICBcclxuICAgICAgICBjb25zdCBwYXJ0aWNsZU1hdGVyaWFsID0gbmV3IFRIUkVFLlBvaW50c01hdGVyaWFsKHtcclxuICAgICAgICAgICAgc2l6ZTogMC4yLFxyXG4gICAgICAgICAgICB2ZXJ0ZXhDb2xvcnM6IHRydWUsIC8vIOmggueCueOBlOOBqOOBruiJsuOCkuS9v+eUqFxyXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICAgICAgb3BhY2l0eTogMC43XHJcbiAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gbmV3IFRIUkVFLlBvaW50cyhnZW9tZXRyeSwgcGFydGljbGVNYXRlcmlhbCk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5wYXJ0aWNsZVN5c3RlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVHb2FsRWxlbWVudCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmdvYWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmdvYWxFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHRoaXMuZ29hbEVsZW1lbnQuc3R5bGUudG9wID0gXCIyMHB4XCI7XHJcbiAgICAgICAgdGhpcy5nb2FsRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCI1MCVcIjtcclxuICAgICAgICB0aGlzLmdvYWxFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgtNTAlKVwiO1xyXG4gICAgICAgIHRoaXMuZ29hbEVsZW1lbnQuc3R5bGUucGFkZGluZyA9IFwiMTBweCAyMHB4XCI7XHJcbiAgICAgICAgdGhpcy5nb2FsRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYmEoMCwgMCwgMCwgMC41KVwiO1xyXG4gICAgICAgIHRoaXMuZ29hbEVsZW1lbnQuc3R5bGUuY29sb3IgPSBcIiNmZmZmZmZcIjtcclxuICAgICAgICB0aGlzLmdvYWxFbGVtZW50LnN0eWxlLmZvbnRTaXplID0gXCIyNHB4XCI7XHJcbiAgICAgICAgdGhpcy5nb2FsRWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XHJcbiAgICAgICAgdGhpcy5nb2FsRWxlbWVudC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjEwcHhcIjtcclxuICAgICAgICB0aGlzLmdvYWxFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjsgLy8g5Yid5pyf54q25oWL44Gn44Gv6Z2e6KGo56S6XHJcbiAgICAgICAgdGhpcy5nb2FsRWxlbWVudC5pbm5lclRleHQgPSBcIuOCtOODvOODqyFcIjtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZ29hbEVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlQ29sbGlzaW9uID0gKGV2ZW50OiB7IGJvZHk6IENBTk5PTi5Cb2R5IH0pID0+IHtcclxuICAgICAgICBpZiAodGhpcy5uZXRCb2RpZXMuaW5jbHVkZXMoZXZlbnQuYm9keSkpIHtcclxuICAgICAgICAgICAgdGhpcy5iYWxsQm9keS52ZWxvY2l0eS5zZXQoMCwgMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmFsbEJvZHkuYW5ndWxhclZlbG9jaXR5LnNldCgwLCAwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R29hbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRpc3BsYXlHb2FsID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZ29hbEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTeXN0ZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYXJ0aWNsZVN5c3RlbSgpOyAvLyDjg5Hjg7zjg4bjgqPjgq/jg6vjgrfjgrnjg4bjg6DjgpLkvZzmiJBcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbS52aXNpYmxlID0gdHJ1ZTsgLy8g44OR44O844OG44Kj44Kv44Or44K344K544OG44Og44KS6KGo56S6XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ29hbEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5wYXJ0aWNsZVN5c3RlbSk7IC8vIOODkeODvOODhuOCo+OCr+ODq+OCt+OCueODhuODoOOCkuOCt+ODvOODs+OBi+OCieWJiumZpFxyXG4gICAgICAgICAgICAgICAgLy8gR2VvbWV0cnnjga7jg6Hjg6Ljg6rop6PmlL5cclxuICAgICAgICAgICAgICAgICh0aGlzLnBhcnRpY2xlU3lzdGVtLmdlb21ldHJ5IGFzIFRIUkVFLkJ1ZmZlckdlb21ldHJ5KS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBNYXRlcmlhbOOBruWPgueFp+OCkuino+mZpFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbS5tYXRlcmlhbCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gbnVsbDsgLy8g44OR44O844OG44Kj44Kv44Or44K344K544OG44Og44Gu5Y+C54Wn44KS5YmK6ZmkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAyMDAwKTsgLy8gMuenkuW+jOOBq+mdnuihqOekulxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU29jY2VyR29hbCA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBnb2FsV2lkdGggPSA3LjMyO1xyXG4gICAgICAgIGNvbnN0IGdvYWxIZWlnaHQgPSAyLjQ0O1xyXG4gICAgICAgIGNvbnN0IGdvYWxEZXB0aCA9IDI7XHJcblxyXG4gICAgICAgIGNvbnN0IHBvc3RNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweGZmZmZmZiB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgY3JlYXRlUG9zdCA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgZGVwdGg6IG51bWJlciwgcG9zaXRpb246IFRIUkVFLlZlY3RvcjMpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkod2lkdGgsIGhlaWdodCwgZGVwdGgpO1xyXG4gICAgICAgICAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHBvc3RNYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIG1lc2gucG9zaXRpb24uY29weShwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKG1lc2gpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMod2lkdGggLyAyLCBoZWlnaHQgLyAyLCBkZXB0aCAvIDIpKTtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XHJcbiAgICAgICAgICAgIGJvZHkuYWRkU2hhcGUoc2hhcGUpO1xyXG4gICAgICAgICAgICBib2R5LnBvc2l0aW9uLnNldChwb3NpdGlvbi54LCBwb3NpdGlvbi55LCBwb3NpdGlvbi56KTtcclxuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KGJvZHkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNyZWF0ZVBvc3QoMC4xLCBnb2FsSGVpZ2h0LCAwLjEsIG5ldyBUSFJFRS5WZWN0b3IzKC1nb2FsV2lkdGggLyAyLCBnb2FsSGVpZ2h0IC8gMiwgMCkpOyAvLyDlt6bliY3jg53jgrnjg4hcclxuICAgICAgICBjcmVhdGVQb3N0KDAuMSwgZ29hbEhlaWdodCwgMC4xLCBuZXcgVEhSRUUuVmVjdG9yMyhnb2FsV2lkdGggLyAyLCBnb2FsSGVpZ2h0IC8gMiwgMCkpOyAvLyDlj7PliY3jg53jgrnjg4hcclxuICAgICAgICBjcmVhdGVQb3N0KGdvYWxXaWR0aCwgMC4xLCAwLjEsIG5ldyBUSFJFRS5WZWN0b3IzKDAsIGdvYWxIZWlnaHQsIDApKTsgLy8g5YmN44Kv44Ot44K544OQ44O8XHJcbiAgICAgICAgY3JlYXRlUG9zdCgwLjEsIGdvYWxIZWlnaHQsIDAuMSwgbmV3IFRIUkVFLlZlY3RvcjMoLWdvYWxXaWR0aCAvIDIsIGdvYWxIZWlnaHQgLyAyLCAtZ29hbERlcHRoKSk7IC8vIOW3puW+jOOCjeODneOCueODiFxyXG4gICAgICAgIGNyZWF0ZVBvc3QoMC4xLCBnb2FsSGVpZ2h0LCAwLjEsIG5ldyBUSFJFRS5WZWN0b3IzKGdvYWxXaWR0aCAvIDIsIGdvYWxIZWlnaHQgLyAyLCAtZ29hbERlcHRoKSk7IC8vIOWPs+W+jOOCjeODneOCueODiFxyXG4gICAgICAgIGNyZWF0ZVBvc3QoZ29hbFdpZHRoLCAwLjEsIDAuMSwgbmV3IFRIUkVFLlZlY3RvcjMoMCwgZ29hbEhlaWdodCwgLWdvYWxEZXB0aCkpOyAvLyDlvozjgo3jgq/jg63jgrnjg5Djg7xcclxuICAgICAgICBjcmVhdGVQb3N0KDAuMSwgMC4xLCBnb2FsRGVwdGgsIG5ldyBUSFJFRS5WZWN0b3IzKC1nb2FsV2lkdGggLyAyLCBnb2FsSGVpZ2h0LCAtZ29hbERlcHRoIC8gMikpOyAvLyDlt6bkuIrjg5Djg7xcclxuICAgICAgICBjcmVhdGVQb3N0KDAuMSwgMC4xLCBnb2FsRGVwdGgsIG5ldyBUSFJFRS5WZWN0b3IzKGdvYWxXaWR0aCAvIDIsIGdvYWxIZWlnaHQsIC1nb2FsRGVwdGggLyAyKSk7IC8vIOWPs+S4iuODkOODvFxyXG4gICAgICAgIGNyZWF0ZVBvc3QoMC4xLCAwLjEsIGdvYWxEZXB0aCwgbmV3IFRIUkVFLlZlY3RvcjMoLWdvYWxXaWR0aCAvIDIsIDAsIC1nb2FsRGVwdGggLyAyKSk7IC8vIOW3puWcsOmdouODkOODvFxyXG4gICAgICAgIGNyZWF0ZVBvc3QoMC4xLCAwLjEsIGdvYWxEZXB0aCwgbmV3IFRIUkVFLlZlY3RvcjMoZ29hbFdpZHRoIC8gMiwgMCwgLWdvYWxEZXB0aCAvIDIpKTsgLy8g5Y+z5Zyw6Z2i44OQ44O8XHJcbiAgICAgICAgY3JlYXRlUG9zdChnb2FsV2lkdGgsIDAuMSwgMC4xLCBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAtZ29hbERlcHRoKSk7IC8vIOW+jOOCjeWcsOmdouODkOODvFxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZU5ldChuZXcgVEhSRUUuVmVjdG9yMygwLCBnb2FsSGVpZ2h0IC8gMiwgLWdvYWxEZXB0aCksIGdvYWxXaWR0aCwgZ29hbEhlaWdodCk7IC8vIOW+jOOCjeODjeODg+ODiFxyXG4gICAgICAgIHRoaXMuY3JlYXRlTmV0KG5ldyBUSFJFRS5WZWN0b3IzKC1nb2FsV2lkdGggLyAyLCBnb2FsSGVpZ2h0IC8gMiwgLWdvYWxEZXB0aCAvIDIpLCBnb2FsRGVwdGgsIGdvYWxIZWlnaHQsIHRydWUpOyAvLyDlt6bjg43jg4Pjg4hcclxuICAgICAgICB0aGlzLmNyZWF0ZU5ldChuZXcgVEhSRUUuVmVjdG9yMyhnb2FsV2lkdGggLyAyLCBnb2FsSGVpZ2h0IC8gMiwgLWdvYWxEZXB0aCAvIDIpLCBnb2FsRGVwdGgsIGdvYWxIZWlnaHQsIHRydWUpOyAvLyDlj7Pjg43jg4Pjg4hcclxuICAgICAgICB0aGlzLmNyZWF0ZU5ldChuZXcgVEhSRUUuVmVjdG9yMygwLCBnb2FsSGVpZ2h0LCAtZ29hbERlcHRoIC8gMiksIGdvYWxXaWR0aCwgZ29hbERlcHRoLCBmYWxzZSwgdHJ1ZSk7IC8vIOS4iumDqOODjeODg+ODiFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlTmV0ID0gKHBvc2l0aW9uOiBUSFJFRS5WZWN0b3IzLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgcm90YXRlWTogYm9vbGVhbiA9IGZhbHNlLCByb3RhdGVYOiBib29sZWFuID0gZmFsc2UpID0+IHtcclxuICAgICAgICBjb25zdCBuZXRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweGZmZmZmZiwgd2lyZWZyYW1lOiB0cnVlIH0pO1xyXG4gICAgICAgIGNvbnN0IG5ldFNlZ21lbnRzID0gMTA7XHJcbiAgICAgICAgY29uc3QgbmV0R2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSh3aWR0aCwgaGVpZ2h0LCBuZXRTZWdtZW50cywgbmV0U2VnbWVudHMpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXRNZXNoID0gbmV3IFRIUkVFLk1lc2gobmV0R2VvbWV0cnksIG5ldE1hdGVyaWFsKTtcclxuICAgICAgICBuZXRNZXNoLnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xyXG5cclxuICAgICAgICBpZiAocm90YXRlWSkge1xyXG4gICAgICAgICAgICBuZXRNZXNoLnJvdGF0ZVkoTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocm90YXRlWCkge1xyXG4gICAgICAgICAgICBuZXRNZXNoLnJvdGF0ZVgoTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobmV0TWVzaCk7XHJcblxyXG4gICAgICAgIC8vIENBTk5PTi5qc+OBrueJqeeQhuODnOODh+OCo+OBruS9nOaIkFxyXG4gICAgICAgIGNvbnN0IG5ldFNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKHdpZHRoIC8gMiwgaGVpZ2h0IC8gMiwgMC4xKSk7IC8vIDAuMeOBruWOmuOBv+OCkuaMgeOBn+OBm+OCi1xyXG4gICAgICAgIGNvbnN0IG5ldEJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAwIH0pOyAvLyDjg43jg4Pjg4jjga/lm7rlrprjgZXjgozjgabjgYTjgovjgZ/jgoHos6rph4/jga8wXHJcbiAgICAgICAgbmV0Qm9keS5hZGRTaGFwZShuZXRTaGFwZSk7XHJcbiAgICAgICAgbmV0Qm9keS5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uIGFzIHVua25vd24gYXMgQ0FOTk9OLlZlYzMpO1xyXG5cclxuICAgICAgICBpZiAocm90YXRlWSkge1xyXG4gICAgICAgICAgICBuZXRCb2R5LnF1YXRlcm5pb24uc2V0RnJvbUF4aXNBbmdsZShuZXcgQ0FOTk9OLlZlYzMoMCwgMSwgMCksIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJvdGF0ZVgpIHtcclxuICAgICAgICAgICAgbmV0Qm9keS5xdWF0ZXJuaW9uLnNldEZyb21BeGlzQW5nbGUobmV3IENBTk5PTi5WZWMzKDEsIDAsIDApLCBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkobmV0Qm9keSk7XHJcbiAgICAgICAgdGhpcy5uZXRCb2RpZXMucHVzaChuZXRCb2R5KTsgLy8g44ON44OD44OI44Gu44Oc44OH44Kj44KS44Oq44K544OI44Gr6L+95YqgXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlSHVtYW4gPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMSwgMiwgMC41KTtcclxuICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweDg4ODg4OCB9KTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuaHVtYW5NZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcclxuICAgICAgICB0aGlzLmh1bWFuTWVzaC5wb3NpdGlvbi5zZXQoMCwgMSwgMC41KTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmh1bWFuTWVzaCk7XHJcbiAgICBcclxuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMygwLjUsIDEsIDAuMjUpKTsgLy8g5q2j44GX44GE5a+45rOVXHJcbiAgICAgICAgdGhpcy5odW1hbkJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiA4MCB9KTtcclxuICAgICAgICB0aGlzLmh1bWFuQm9keS5hZGRTaGFwZShzaGFwZSk7XHJcbiAgICAgICAgdGhpcy5odW1hbkJvZHkucG9zaXRpb24uc2V0KDAsIDEsIDAuNSk7XHJcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHRoaXMuaHVtYW5Cb2R5KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1vdmVIdW1hblRvID0gKHBvc2l0aW9uOiBDQU5OT04uVmVjMykgPT4ge1xyXG4gICAgICAgIHRoaXMuaHVtYW5Cb2R5LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMuaHVtYW5Cb2R5LnZlbG9jaXR5LnNldCgwLCAwLCAwKTsgLy8g6YCf5bqm44KS44Oq44K744OD44OIXHJcbiAgICAgICAgdGhpcy5odW1hbkJvZHkuYW5ndWxhclZlbG9jaXR5LnNldCgwLCAwLCAwKTsgLy8g6KeS6YCf5bqm44KS44Oq44K744OD44OIXHJcbiAgICAgICAgdGhpcy5odW1hbkJvZHkucXVhdGVybmlvbi5zZXQoMCwgMCwgMCwgMSk7IC8vIOWbnui7ouOCkuODquOCu+ODg+ODiFxyXG4gICAgXHJcbiAgICAgICAgLy8g44Oh44OD44K344Ol44KC5ZCM5qeY44Gr44Oq44K744OD44OI44GZ44KLXHJcbiAgICAgICAgdGhpcy5odW1hbk1lc2gucG9zaXRpb24uY29weSh0aGlzLmh1bWFuQm9keS5wb3NpdGlvbiBhcyB1bmtub3duIGFzIFRIUkVFLlZlY3RvcjMpO1xyXG4gICAgICAgIHRoaXMuaHVtYW5NZXNoLnF1YXRlcm5pb24uY29weSh0aGlzLmh1bWFuQm9keS5xdWF0ZXJuaW9uIGFzIHVua25vd24gYXMgVEhSRUUuUXVhdGVybmlvbik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgc3luY01lc2hXaXRoQm9keSA9IChtZXNoOiBUSFJFRS5NZXNoLCBib2R5OiBDQU5OT04uQm9keSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZTogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xyXG4gICAgICAgICAgICBtZXNoLnBvc2l0aW9uLmNvcHkoYm9keS5wb3NpdGlvbiBhcyB1bmtub3duIGFzIFRIUkVFLlZlY3RvcjMpO1xyXG4gICAgICAgICAgICBtZXNoLnF1YXRlcm5pb24uY29weShib2R5LnF1YXRlcm5pb24gYXMgdW5rbm93biBhcyBUSFJFRS5RdWF0ZXJuaW9uKTtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQmFsbCA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBiYWxsUmFkaXVzID0gMC41O1xyXG4gICAgICAgIGNvbnN0IGJhbGxTaGFwZSA9IG5ldyBDQU5OT04uU3BoZXJlKGJhbGxSYWRpdXMpO1xyXG4gICAgICAgIHRoaXMuYmFsbEJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAxIH0pO1xyXG4gICAgICAgIHRoaXMuYmFsbEJvZHkuYWRkU2hhcGUoYmFsbFNoYXBlKTtcclxuICAgICAgICB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLnNldCgwLCBiYWxsUmFkaXVzLCA1KTtcclxuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkodGhpcy5iYWxsQm9keSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJhbGxHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeShiYWxsUmFkaXVzLCAzMiwgMzIpO1xyXG4gICAgICAgIGNvbnN0IGJhbGxNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweDAwMDBmZiB9KTtcclxuICAgICAgICB0aGlzLmJhbGxNZXNoID0gbmV3IFRIUkVFLk1lc2goYmFsbEdlb21ldHJ5LCBiYWxsTWF0ZXJpYWwpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuYmFsbE1lc2gpO1xyXG5cclxuICAgICAgICB0aGlzLmJhbGxCb2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbGxpZGUnLCB0aGlzLmhhbmRsZUNvbGxpc2lvbik7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24pO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXlVcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNldEJhbGxQb3NpdGlvbiA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLnNldCgwLCAwLjUsIDUpOyAvLyDliJ3mnJ/kvY3nva7jgavjg6rjgrvjg4Pjg4hcclxuICAgICAgICB0aGlzLmJhbGxCb2R5LnZlbG9jaXR5LnNldCgwLCAwLCAwKTsgLy8g6YCf5bqm44KS44K844Ot44Gr44Oq44K744OD44OIXHJcbiAgICAgICAgdGhpcy5iYWxsQm9keS5hbmd1bGFyVmVsb2NpdHkuc2V0KDAsIDAsIDApOyAvLyDop5LpgJ/luqbjgpLjgrzjg63jgavjg6rjgrvjg4Pjg4hcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZUtleURvd24gPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICBjb25zdCBpbXB1bHNlID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICAgICAgY29uc3Qgd29ybGRQb2ludCA9IG5ldyBDQU5OT04uVmVjMyh0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLngsIHRoaXMuYmFsbEJvZHkucG9zaXRpb24ueSwgdGhpcy5iYWxsQm9keS5wb3NpdGlvbi56KTtcclxuICAgIFxyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOlxyXG4gICAgICAgICAgICAgICAgaW1wdWxzZS5zZXQoMCwgMCwgLTEwKTsgLy8g5YmN44Gr6aOb44Gw44GZXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LmFwcGx5SW1wdWxzZShpbXB1bHNlLCB3b3JsZFBvaW50KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxyXG4gICAgICAgICAgICAgICAgaW1wdWxzZS5zZXQoMCwgNSwgLTEwKTsgLy8g5pac44KB5LiK44Gr6aOb44Gw44GZXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LmFwcGx5SW1wdWxzZShpbXB1bHNlLCB3b3JsZFBvaW50KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxyXG4gICAgICAgICAgICAgICAgaW1wdWxzZS5zZXQoLTMuNSwgMCwgLTkpOyAvLyDlt6bjgavpo5vjgbDjgZlcclxuICAgICAgICAgICAgICAgIHRoaXMuYmFsbEJvZHkuYXBwbHlJbXB1bHNlKGltcHVsc2UsIHdvcmxkUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxyXG4gICAgICAgICAgICAgICAgaW1wdWxzZS5zZXQoMy41LCAwLCAtOSk7IC8vIOWPs+OBq+mjm+OBsOOBmVxyXG4gICAgICAgICAgICAgICAgdGhpcy5iYWxsQm9keS5hcHBseUltcHVsc2UoaW1wdWxzZSwgd29ybGRQb2ludCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnICc6IC8vIOOCueODmuODvOOCueOCreODvOOBp+ODnOODvOODq+OCkuWFg+OBruS9jee9ruOBq+ODquOCu+ODg+ODiFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldEJhbGxQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3MnOiAvLyAncycg44Kt44O844Gn5Lq644KS55yf44KT5Lit44Gr5YuV44GL44GZXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVIdW1hblRvKG5ldyBDQU5OT04uVmVjMygwLCAxLCAwLjUpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdyJzogLy8gJ3InIOOCreODvOOBp+S6uuOCkuWPs+OBq+WLleOBi+OBmVxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlSHVtYW5UbyhuZXcgQ0FOTk9OLlZlYzMoMiwgMSwgMC41KSk7IC8vIOWPs+OBruS9jee9ruOBq+WkieabtFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2wnOiAvLyAnbCcg44Kt44O844Gn5Lq644KS5bem44Gr5YuV44GL44GZXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVIdW1hblRvKG5ldyBDQU5OT04uVmVjMygtMiwgMSwgMC41KSk7IC8vIOW3puOBruS9jee9ruOBq+WkieabtFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlS2V5VXAgPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xyXG4gICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcclxuICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcclxuICAgICAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcclxuICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LnZlbG9jaXR5LnNldCgwLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xyXG4gICAgbGV0IHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKDY0MCwgNDgwLCBuZXcgVEhSRUUuVmVjdG9yMyg1LCA1LCA1KSk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiLWU1OGJkMlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==