


function makeParticles() {

	var particle, material;

	for ( var i = 0; i < 400; i ++) {
		material = new THREE.ParticleCanvasMaterial({
			color : 0xcc0000,
			program : particleRender
		});
		particle = new THREE.Particle(material);

		particle.position.x = Math.random() * 2 - 1;
		particle.position.y = Math.random() * 2 - 1;
		particle.position.z = Math.random() * 2 - 1;
		
		particle.position.normalize();
		particle.position.multiplyScalar( 450 );
		particle.scale.x = particle.scale.y = 5;

		//scene.add(particle);
		parent.add(particle);
		particles.push(particle);
		geometry.vertices.push( new THREE.Vertex( particle.position ) );

	}
	
	function particleRender(context) {
		context.beginPath();
		context.arc(0, 0, 1, 0, Math.PI * 2, true);
		context.fill();
	}
}

/*
function makeCubes() {
	var geometry = new THREE.CubeGeometry(100, 100, 100);

	for ( var i = 0; i < 10; i++) {

		var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
			color : Math.random() * 0xffffff,
			opacity : 0.5
		}));
		object.position.x = Math.random() * 800 - 400;
		object.position.y = Math.random() * 800 - 400;
		object.position.z = Math.random() * 800 - 400;

		object.scale.x = Math.random() * 2 + 1;
		object.scale.y = Math.random() * 2 + 1;
		object.scale.z = Math.random() * 2 + 1;

		object.rotation.x = (Math.random() * 360) * Math.PI / 180;
		object.rotation.y = (Math.random() * 360) * Math.PI / 180;
		object.rotation.z = (Math.random() * 360) * Math.PI / 180;

		scene.add(object);

		cubes.push(object);

	}
}*/
