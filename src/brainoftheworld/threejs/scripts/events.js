var INTERSECTED, SELECTED;
var mouse = new THREE.Vector2();

function onDocumentMouseDown(event) {

	event.preventDefault();

	var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
	projector.unprojectVector(vector, camera);

	var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

	var intersects = ray.intersectObjects(particles);

	particles.forEach(function(it) {
		it.material.color.setHex(0xcc0000);
	});
	if(intersects.length > 0) {
		SELECTED = intersects[0].object;
		SELECTED.material.color.setHex(0x006600);
		var intersects = ray.intersectObject(plane);
		offset.copy(intersects[0].point).subSelf(plane.position);
		container.style.cursor = 'move';
	} else {
		mouseXOnMouseDown = event.clientX - windowHalfX;
		mouseYOnMouseDown = event.clientY - windowHalfY;
		targetRotationXOnMouseDown = targetRotationX;
		targetRotationYOnMouseDown = targetRotationY;
	}
	

	//renderer.render(scene, camera);

}

function onMouseMove(event) {

	event.preventDefault();

	mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight ) * 2 + 1;
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

	//

	var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
	projector.unprojectVector(vector, camera);

	var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

	if(SELECTED) {
		var intersects = ray.intersectObject(plane);
		SELECTED.position.copy(intersects[0].point.subSelf(offset));
		return;
	}

	var intersects = ray.intersectObjects(particles);

	if(intersects.length > 0) {

		if(INTERSECTED != intersects[0].object) {

			if(INTERSECTED)
				INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
			INTERSECTED = intersects[0].object;
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

			plane.position.copy(INTERSECTED.position);

		}

		container.style.cursor = 'pointer';

	} else {

		if(INTERSECTED)
			INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
		INTERSECTED = null;

		container.style.cursor = 'auto';
		targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown ) * 0.02;
		targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown ) * 0.02;

	}
	//renderer.render(scene, camera);
}

function onMouseUp(event) {

	event.preventDefault();

	// if(INTERSECTED) {
// 
		// plane.position.copy(INTERSECTED.position);
		SELECTED = null;

	// }

	container.style.cursor = 'auto';
}

function onScroll(event) {
	var delta = 0;

	if(!event)
		event = window.event;

	// normalize the delta
	if(event.wheelDelta) {

		// IE and Opera
		delta = event.wheelDelta / 60;

	} else if(event.detail) {

		// W3C
		delta = -event.detail / 2;
	}

	// alert(delta);
	camera.position.z += 200 * delta;
	camera.lookAt(scene.position);
	//renderer.render(scene, camera);
}