$(function() {
	var dialog;
	$('#create').on('click', function() {
		dialog = $.vmc.dialog({
			//full:true,
			//show: false,
			type: 'frame',
			//body: '<div class="vuidg-content-text"><a>你为什么dsfaasdfasdf的说法大赛发撒旦发撒旦好</a><p>为什么dsfaasdfasdf的说法大赛发撒旦发撒旦</p></div>',
			body: 'http://192.168.1.2/',
			//size: ['auto', 'auto'],
			size: [300, 300],
			//pos: [100, 100, 4],
			fix: true,
			//modal: false,
			time: 2,
			overlayClose: true,
			//shade: false,
			//borderWidth:0,
			//draggable:false,
			//range: false,
			//closeTrue:true,
			close: function() {},
			button: [{
				text: '按钮',
				click: function(vui) {
					vui.close();
				}
			}]
		});
	});
	$('#open').on('click', function() {
		if (dialog) {
			dialog.open();
		}
	});
	$('#close').on('click', function() {
		if (dialog) {
			dialog.close();
		}
	});
	$('#msg').on('click', function() {
		$.vmc.msg('提示消息');
	});
	$('#alert').on('click', function() {
		$.vmc.alert('警告提示', function() {
			$.vmc.msg('好的');
		});
	});
	$('#confirm').on('click', function() {
		$.vmc.confirm('确认删除？', function() {
			$.vmc.msg('删除成功！');
		}, function() {
			$.vmc.msg('删除失败！');
		});
	});
	
});