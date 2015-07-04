function __like() {
	var href = 'http://www.facebook.com/sharer.php?u=' + window.location;
	__window(href, href);
	return false;
}

function __tweet() {
	var href = 'https://twitter.com/share?url=' + window.location;
	__window(href, href);
	return false;
}

function __window(title, href) {
	var params = "width=420,height=400,menubar=no,location=no,resizable=no,scrollbars=no,status=no,top=200,left=200"
	var w = window.open(href, title, params);
	w.focus();
}

function CFHover(oElem) {
	if (oElem.id === 'clear') {
		oElem.src = '/Data/Design/Images/btn-clear-h.png';
	} else {
		oElem.src = '/Data/Design/Images/btn-send-h.png';
	}
}

function CFOut(oElem) {
	if (oElem.id === 'clear') {
		oElem.src = '/Data/Design/Images/btn-clear.png';
	} else {
		oElem.src = '/Data/Design/Images/btn-send.png';
	}
}

var ContactFormClear = function(button) {
	button.form.reset();
	return false;
};

var ContactFormSubmit = function(form) {
	if (form.name.value == '') {
		alert('Field "Name" can not be empty.');
	} else if (form.email.value == '') {
		alert('Field "E-mail" can not be empty.')
	} else if (form.phone.value == '') {
		alert('Field "Phone" can not be empty.')
	} else if (form.message.value == '') {
		alert('Field "Message" can not be empty.')
	} else {

		var sName = form.name.value;
		var sEmail = form.email.value;
		var sPhone = form.phone.value;
		var sFax = form.fax.value;
		var sCompany = form.company.value;
		var sAddress = form.address.value;
		var sMsg = form.message.value;

		var sParams = 'name=' + sName + '&email=' + sEmail + '&phone=' + sPhone
				+ '&fax=' + sFax + '&company=' + sCompany + '&address='
				+ sAddress + '&message=' + sMsg;

		var myRequest = new Request({
		    url: '/ajax/?action=contact',
		    method: 'post',
		    onSuccess: function(responseText){
				alert(responseText);
				form.reset();
		    },
		    onFailure: function(){
		        alert('Sorry, your request failed :(');
		    }
		}).send(sParams);
	}
	return false;
};

var center = {

	get : function(obj) {
		var coord = $(obj).getCoordinates();
		return {
			x :Math.round((coord.right - coord.left) / 2),
			y :Math.round((coord.bottom - coord.top) / 2)
		};
	},

	set : function(obj, center) {

		var coord = $(obj).getSize();

		$(obj).setPosition( {
			x :center.x - Math.round(coord.x / 2),
			y :center.y - Math.round(coord.y / 2)
		});
	}
};

var project = {

	history : 0,
		
	index : 0,
		
	video :false,

	loading :false,

	src :'',

	set : function(src, width, height, pos, type, file) {
	
		if (project.loading) {
			return false;
		}

		if (project.src == src) {
			return false;
		}

		project.index = pos - 1;
		
		project.loading = true;
		
		//$('arrow-left-project').setStyle('display', 'none');
		//$('arrow-right-project').setStyle('display', 'none');

		var obj = $('lenta_cell_' + pos);

		obj.addClass('active');

		if (project.active) {
			project.active.removeClass('active');
		}

		project.active = obj;

		project.loader(pos, 0.45);

		project.src = src;
		project.width = width;
		project.height = height;

		project.type = type;

		$('layout').setStyle('height', '100%');
		
		switch (project.type) {

		case 'swf':

			if (project.img) {
				project.img.fade(0);
			}

			if (project.conteiner) {
				project.conteiner.dispose();
				project.conteiner = null;
			}

			project.swf = new Swiff(file, {
				id :'project_player',
				width :width,
				height :height,
				params : {
					wMode :'opaque',
					bgcolor :'#000000'
				}
			});

			project.conteiner = new Element('div');

			project.conteiner.id = 'project_conteiner';

			project.conteiner.setStyles( {
				'opacity' :0,
				'position' :'absolute'
			});

			project.swf.inject(project.conteiner);

			project.conteiner.inject($('project_content'));

			( function() {

				project.resize();

				project.conteiner.fade(1);

				project.loading = false;

				project.loader(pos, 0);

			}).delay(600);

			$('layout').setStyle('height', height+232);
			
			break;

		case 'flv':
			
			if (project.conteiner) {
				project.conteiner.fade(0);
			}
			
			if (project.img) {
				project.img.fade(0);
			}

			if (project.conteiner) {
				project.conteiner.dispose();
				project.conteiner = null;
			}
			
			project.conteiner = new Element('div', {
				html :'<div id="player">player</div>'
			});

			project.conteiner.id = 'project_conteiner';

			project.conteiner.setStyles( {
				'opacity' :0,
				'position' :'absolute'
			});

			project.conteiner.inject($('project_content'));

			var flashvars = {
				'file' : file,
				'logo.hide' : 'true',
				'backcolor' : '000000',
				'frontcolor' : 'f1f1f1',
				'lightcolor' : '008ecd',
				'screencolor' : '000000',
				'controlbar' : 'over',
				'viral.allowmenu' : 'false',
				'stretching' : 'uniform',
				'skin': '/Data/Design/Video/bekle.zip'
			};
			var params = {
				allowfullscreen :'true',
				allowscriptaccess :'always',
				wmode :'opaque'
			};
			var attributes = {
				id :'player',
				name :'player'
			};
			
			swfobject.embedSWF('/Data/Design/Video/player.swf', 'player',
					width, height, '9.0.115', '#000000', flashvars, params,
					attributes);

			project.loader(pos, 0);

			( function() {
				project.resize();
				project.conteiner.fade(1);
				project.loading = false;
				project.video = true;
			}).delay(1000);
			
			$('layout').setStyle('height', height+232);
		
			break;

		case 'img':

			if (project.conteiner) {
				project.conteiner.fade(0);
			}

			this.image(src, pos);
			break;

		}
		
		window.location.hash = pos;
		
		project.history--;
	},

	image : function(src, pos) {

		if ($('project_image')) {
			project.old = $('project_image');
			project.old.id = 'project_image_old';
		}

		project.img = new Asset.image(src, {

			id :'project_image',

			onload : function() {

				if (project.old) {
					project.old.fade(0);
				}

				( function() {

					if (project.old) {
						project.old.dispose();
					}

					if (project.conteiner) {
						project.conteiner.dispose();
						project.conteiner = null;
					}

					project.resize();

					project.img.fade(1);

					project.loader(pos, 0);

					project.loading = false;

				}).delay(500);
			},

			onerror : function() {

				project.loader(pos, 0);

				project.loading = false;
			}
		});

		project.img.setStyles( {
			'opacity' :0,
			'position' :'absolute'
		});

		project.img.inject($('project_content'), 'top');
	},

	loader : function(pos, fade) {
		( function() {
			$('lenta_cell_loader_' + pos).fade(fade)
		}).delay(200);
	},

	resize : function() {

		var c = center.get('project_content');

		var size = $('project_content').getSize();

		if (project.img) {

			var delta = 1;

			delta = size.y / project.height;

			project.img.width = Math.round(project.width * delta);
			project.img.height = Math.round(project.height * delta);

			project.img.setPosition( {
				x :c.x - Math.round(project.img.width / 2),
				y :c.y - Math.round(project.img.height / 2)
			});
		}
		if (project.conteiner) {

			project.conteiner.setPosition( {
				x :c.x - Math.round(project.width / 2),
				y :c.y - Math.round(project.height / 2)
			});
		}
		
		var pos = project.index + 1;
		
		$('arrow-left-project').setStyle('display', 'none');
		$('arrow-right-project').setStyle('display', 'none');
		
		if (lenta.length > 1) {
			
			if (pos > 1) {
				$('arrow-left-project').setStyle('display', 'block');
			}
			
			if (pos < lenta.length) {
				$('arrow-right-project').setStyle('display', 'block');
			}
		}
	}
};

var background = {

	loading :false,

	set : function(src, width, height, pos) {

		if (background.loading) {
			return false;
		}
		
		var obj = $('lenta_cell_' + pos);

		obj.addClass('active');

		if (background.active) {
			$(background.active).removeClass('active');
		}

		background.active = obj;

		background.loading = true;

		background.width = width;
		background.height = height;

		background.loader(pos, 0.45);

		background.old = $('background_image');

		background.old.id = 'background_image_old';

		background.img = new Asset.image(src, {

			id :'background_image',

			onload : function() {

				if (background.old) {
					background.old.fade(0);
				}

				( function() {

					background.old.dispose();

					background.resize();

					background.img.fade(1);

					background.loader(pos, 0);

					background.loading = false;
					
					if (lenta[pos-1][4]) {
						$('project-title').set('text', lenta[pos-1][4]);
						$('project-title').set('href', lenta[pos-1][5]);
					}

				}).delay(500);
			},

			onerror : function() {
				background.loader(pos, 0);
			}
		});

		background.img.setStyles( {
			'opacity' :0,
			'position' :'absolute'
		});

		background.img.inject($('layout'), 'top');
	},

	loader : function(pos, fade) {
		( function() {
			$('lenta_cell_loader_' + pos).fade(fade)
		}).delay(200);
	},

	resize : function() {

		var c = center.get('layout');

		var size = $('layout').getSize();

		var delta = 1;

		background.img.width = background.width;
		background.img.height = background.height;

		delta = size.y / background.height;

		if (Math.round(background.width * delta) < size.x) {
			delta = size.x / background.width;
		}

		background.img.width = Math.round(background.width * delta);
		background.img.height = Math.round(background.height * delta);

		background.img.setPosition( {
			x :c.x - Math.round(background.img.width / 2),
			y :c.y - Math.round(background.img.height / 2)
		});
	}
};

var projects = {

	loaing :false,

	set : function(src, width, height) {

		if (projects.loading) {
			return false;
		}

		projects.loading = true;

		projects.width = width;
		projects.height = height;

		projects.old = $('background_image');

		projects.old.id = 'background_image_old';

		projects.img = new Asset.image(src, {

			id :'background_image',

			onload : function() {

				if (projects.old) {
					projects.old.fade(0);
				}

				( function() {

					projects.old.dispose();

					projects.resize();

					projects.img.fade(1);

					projects.loading = false;

				}).delay(500);
			},

			onerror : function() {
			}
		});

		projects.img.setStyles( {
			'opacity' :0,
			'position' :'absolute'
		});

		projects.img.inject($('layout'), 'top');
	},

	resize : function() {

		var c = center.get('layout');

		var size = $('layout').getSize();

		var delta = 1;

		projects.img.width = projects.width;
		projects.img.height = projects.height;

		delta = size.y / projects.height;

		if (Math.round(projects.width * delta) < size.x) {
			delta = size.x / projects.width;
		}

		projects.img.width = Math.round(projects.width * delta);
		projects.img.height = Math.round(projects.height * delta);

		projects.img.setPosition( {
			x :c.x - Math.round(projects.img.width / 2),
			y :c.y - Math.round(projects.img.height / 2)
		});
	}
}

var index = 0;

var timer = null;

var ___bg_loop = function() {

	new Asset.image(lenta[index][0], {

		onload : function() {

			background.set(lenta[index][0], lenta[index][1], lenta[index][2],
					index + 1);

			index++;

			if (index == lenta.length) {
				index = 0;
			}

			timer = ___bg_loop.delay(20000);
		}
	});
}

var __set_bg = function(src, width, height, pos ) {
	
	if (timer) {
		clearTimeout(timer);
	}
		
	index = pos;
	
	if (index == lenta.length) {
		index = 0;
	}
		
	timer = ___bg_loop.delay(20000);
		
	background.set(src, width, height, pos );
}

var gallery = new Class({

	Implements : [ Options ],

	options : {
		duration : 'normal',
		transition :Fx.Transitions.linear,
		width :107,
		margin :0,
		center: true
	},

	initialize : function(gallery, holder, options) {

		this.gallery = $(gallery);

		this.holder = $(holder);

		this.setOptions(options);

		this.left = $('gotoLeft');

		this.right = $('gotoRight');

		this.left.setStyle('display', 'none');

		this.length = this.holder.getElements('td').length
				* this.options.width;

		if (this.length < this.gallery.getSize().x) {
			this.right.setStyle('display', 'none');
			
			if (this.options.center) {
				this.holder.setStyle('margin-left', (this.gallery.getSize().x - this.length - 9) / 2);
			}
		}
		
		this.holder.set("tween", {
			fps : 75,
			duration :this.options.duration,
			transition :this.options.transition,
			property :'margin-left'
		});

		this.left.addEvent('click', function() {
			
			var margin = this.holder.getStyle('margin-left').toInt()
					+ (this.options.width * 4);
				if (margin >= this.options.margin){
					margin = this.options.margin;
					this.left.setStyle('display', 'none');
				}
				this.holder.tween(margin);
				
				this.right.setStyle('display', 'block');
				
			}.bind(this));

		this.right.addEvent('click', function() {
			var margin = this.holder.getStyle('margin-left').toInt()
					- (this.options.width * 4);
				var stop = -1
						* (this.length - this.gallery.getSize().x);
				if (margin < stop){
					margin = stop;
					this.right.setStyle('display', 'none');
				}
				this.holder.tween(margin);
				
				this.left.setStyle('display', 'block');

			}.bind(this));

		window.addEvent('resize', function() {

			var margin = this.length
					+ this.holder.getStyle('margin-left').toInt();

			var x = this.gallery.getSize().x;

			if (this.length > x && margin < x) {
				margin = -1 * (this.length - this.gallery.getSize().x);
				this.holder.tween(margin);
				this.right.setStyle('display', 'none');

			} else if (this.length < x) {
				
				if (this.options.center && (this.length < this.gallery.getSize().x)) {
					this.holder.tween((this.gallery.getSize().x - this.length - 9) / 2);
				} else {
					this.holder.tween(this.options.margin);
				}
				this.left.setStyle('display', 'none');
				this.right.setStyle('display', 'none');
			} else {
				if (this.holder.getStyle('margin-left').toInt() < 0){
					this.left.setStyle('display', 'block');
				}
				this.right.setStyle('display', 'block');
				
				if (this.options.center && (this.holder.getStyle('margin-left').toInt() > this.options.margin)){
					this.holder.tween(this.options.margin);
				}
			}		
		}.bind(this));
	}
});

window.addEvent('domready', function() {
	$('loader').setStyle('opacity', 0.45);
});

