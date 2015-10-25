/**
 * Vmc Dialog v1.0.0 弹层插件
 * 维米客网页工作室
 * http://www.vomoc.com/vmc/dialog/
 * vomoc@qq.com
 * 2015/07/05
 **/
;
(function($, undefined) {
	$.vmc = $.vmc || {};
	$.vmc.dialog = function(options) {
		return new dialog(options).init();
	};
	$.vmc.dialogHandle = function() {
		return handle;
	};
	//*************************************************************************************/
	$.vmc.msg = function() {
		var text = '',
			time = 2,
			close = function() {},
			opts = {};
		$.each(arguments, function(i, data) {
			if (typeof(data) === 'string') {
				text = data;
			} else if (typeof(data) === 'number') {
				time = data;
			} else if ($.isFunction(data)) {
				close = data;
			} else if ($.isPlainObject(data)) {
				opts = data;
			}
		});
		var options = {
			type: 'html',
			body: '<div class=\'vuidg-content-text\'>' + text + '</div>',
			title: false,
			time: time,
			closeTrue: true,
			close: close
		};
		options = $.extend({}, options, opts);
		return new dialog(options).init();
	};
	//*************************************************************************************/
	$.vmc.alert = function() {
		var text = '',
			close = function() {},
			opts = {};
		$.each(arguments, function(i, data) {
			if (typeof(data) === 'string') {
				text = data;
			} else if ($.isFunction(data)) {
				close = data;
			} else if ($.isPlainObject(data)) {
				opts = data;
			}
		});
		var options = {
			type: 'html',
			body: '<div class=\'vuidg-content-text\'>' + text + '</div>',
			title: '系统消息',
			overlayClose: false,
			closeTrue: true,
			close: close,
			button: [{
				text: '确定',
				click: function(vui) {
					vui.close();
				}
			}]
		};
		options = $.extend({}, options, opts);
		return new dialog(options).init();
	};
	//*************************************************************************************/
	$.vmc.confirm = function() {
		var text = '',
			yes, no = function() {},
			opts = {};
		$.each(arguments, function(i, data) {
			if (typeof(data) === 'string') {
				text = data;
			} else if ($.isFunction(data)) {
				if (yes) {
					no = data;
				} else {
					yes = data;
				}
			} else if ($.isPlainObject(data)) {
				opts = data;
			}
		});
		if (!yes) {
			yes = function() {};
		}
		var options = {
			type: 'html',
			body: '<div class=\'vuidg-content-text\'>' + text + '</div>',
			title: '确认对话框',
			titleClose: false,
			overlayClose: false,
			closeTrue: true,
			button: [{
				'text': '确定',
				'click': function(vui) {
					vui.close();
					yes(vui);
				}
			},
			{
				'text': '取消',
				'click': function(vui) {
					vui.close();
					no(vui);
				}
			}]
		};
		options = $.extend({}, options, opts);
		return new dialog(options).init();
	};
	//*************************************************************************************/
	// 全局参数
	var init = {
		// 版本
		version: '0.0.5',
		// 是否是IE6
		ie6: !-[1, ] && !window.XMLHttpRequest,
		// 是否有滚动条 0无滚动条，大于1有滚动条
		fix: 0,
		// 所有对话框的最大zindex
		zindex: 0
	};
	//*************************************************************************************/
	// 窗口句柄
	var handle = {};
	//*************************************************************************************/
	var dialog = function(options) {
		var $this = this;
		// 合并选项
		$this.options = $.extend({}, $this.options, options);
		// 更新选项
		if (true === $this.options.full) {
			$this.options.fix = true;
			$this.options.pos = [0, 0, 1];
			$this.options.borderWidth = 0;
			$this.options.draggable = false;
			$this.options.modal = false;
			$this.options.shade = false;
		}
		if (false === $this.options.title) {
			$this.options.titleClose = false;
			$this.options.draggable = false;
		}
		// 最大的zindex增量
		init.zindex++;
		init.zindex = Math.max($this.options.zIndex, init.zindex);
		$this.options.zIndex = init.zindex;
		// DOM对象集合
		$this.elem = {
			win: $(window),
			doc: $(document),
			body: $(document.body)
		};
		// dialog相对屏幕位置，滚动条偏移
		$this.offset = {
			x: init.ie6 ? $this.elem.win.scrollLeft() : 0,
			y: init.ie6 ? $this.elem.win.scrollTop() : 0
		}
		// 相对dialog的wrap位置
		$this.pos = {
			x: 0,
			y: 0
		};
		// 对话框尺寸
		$this.size = {
			width: 0,
			height: 0,
			titleHeight: 0,
			contentHeight: 0,
			buttonHeight: 0
		};
		// 时间戳
		$this.timestamp = new Date().getTime();
		// 注册句柄
		handle[$this.timestamp] = $this;
	};
	//*************************************************************************************/
	// 默认选项
	dialog.prototype.options = {
		// 主题皮肤
		theme: 'default',
		// 创建时默认是否隐藏
		show: true,
		// 是否全屏
		full: false,
		// 禁用滚动条
		fix: false,
		// 窗口类型，text|html|dom|frame
		type: 'text',
		// type非FRAME时窗口显示内容,type为FRAME时窗口调用网址
		body: '',
		// 标题文字 false|显示文字
		title: '新建窗口',
		// 标题是否有关闭按钮
		titleClose: true,
		// 拖拽标题栏移动窗口位置
		draggable: true,
		// 拖拽范围限制
		range: true,
		// 是否使用按钮 false|[{text:(string),click:(function)},{text:(string),click:(function)}]
		button: false,
		// 延迟关闭(秒) 0不关闭
		time: 0,
		// 窗口尺寸 [宽度auto|(number), 高度auto|(number)]
		size: ['auto', 'auto'],
		// 内容最小尺寸，size为auto时有效 [宽度(number), 高度(number)]
		minSize: [180, 30],
		// 窗口位置[X轴auto|(number), Y轴auto|(number), 参考位置[1-4]] 
		pos: ['auto', 'auto', 1],
		// 层叠顺序
		zIndex: 99999,
		// 对话框背景颜色
		backgroundColor: '#FFF',
		// 对话框边框宽度
		borderWidth: 1,
		// 对话框边框颜色
		borderColor: '#444',
		// 是否显示阴影
		shade: true,
		// 阴影宽度
		shadeBorder: 4,
		// 阴影颜色
		shadeColor: '#000',
		// 阴影透明度
		shadeOpacity: 0.3,
		// 是否为模态行为，模态行为时有遮罩层
		modal: true,
		// 遮罩层颜色
		overlayColor: '#000',
		// 遮罩层透明度
		overlayOpacity: 0.3,
		// 是否点击遮罩层关闭窗口
		overlayClose: true,
		// 彻底关闭
		closeTrue: false,
		// 窗口创建完成回调函数
		create: function(vui) {},
		// 销毁窗口回调函数
		destroy: function(vui) {},
		// 关闭前回调函数，如果返回false，则取消关闭
		beforeClose: function(vui) {},
		// 关闭窗口后回调函数
		close: function(vui) {},
		// 打开窗口前回调函数
		beforeOpen: function(vui) {},
		// 打开窗口后回调函数
		open: function(vui) {}
	};
	//*************************************************************************************/
	dialog.prototype.init = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options;
		// 创建DOM对象
		$this.create();
		// 执行创建窗口成功回调事件
		opts.create($this);
		// 获取尺寸
		$this.getSize();
		$elem.dialog.addClass('vui-hide');
		$elem.dialog.removeClass('vui-hidden');
		// 显示
		if (true === opts.show) {
			$this.open();
		}
		// 注册窗口置顶
		$this.layerToTop();
		// 注册改变窗口大小事件
		$elem.win.on('resize', {
			vui: $this
		}, $this.onResize);
		// 注册窗口滚动事件
		if (init.ie6) {
			$elem.win.on('scroll', {
				vui: $this
			}, $this.onScroll);
		}
		// 设置拖拽
		$this.draggable();
		// 返回DOM对象
		return $this;
	};
	//*************************************************************************************/
	// 销毁窗口
	dialog.prototype.destroy = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options;
		// 执行销毁窗口回调事件
		opts.destroy($this);
		// 销毁延迟关闭计时器
		clearTimeout($this._closeTime);
		if (init.ie6) {
			$elem.win.unbind('scroll', $this.onScroll);
		}
		$elem.win.unbind('resize', $this.onResize);
		// 处理滚动条显示
		if ($this.isShow()) {
			true === opts.fix && init.fix--;
			$this.setFix();
		}
		// 删除DOM对象
		$elem.dialog.remove();
		// 从句柄中删除
		delete handle[$this.timestamp];
	};
	//*************************************************************************************/
	// 打开/显示窗口
	dialog.prototype.open = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options;
		if (handle[$this.timestamp] && false === $this.isShow()) {
			// 执行打开窗口前回调
			opts.beforeOpen($this);
			// 处理滚动条
			true === opts.fix && init.fix++;
			$this.setFix();
			// 更新尺寸
			$this.updateSize();
			// 获取窗口位置
			$this.getPos();
			// 设置窗口位置
			$this.setPos();
			// 设置窗口样式
			$this.setStyle();
			// 显示窗口
			$elem.dialog.removeClass('vui-hide');
			// 显示窗口后回调
			opts.open($this);
			// 自动关闭窗口
			$this.autoClose();
		}
	};
	//*************************************************************************************/
	// 关闭/隐藏窗口
	dialog.prototype.close = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options;
		if (handle[$this.timestamp] && true === $this.isShow()) {
			// 执行关闭窗口前回调
			opts.beforeClose($this);
			// 销毁延迟关闭计时器
			clearTimeout($this._closeTime);
			// 处理滚动条
			true === opts.fix && init.fix--;
			$this.setFix();
			// 隐藏窗口
			$elem.dialog.addClass('vui-hide');
			// 执行关闭窗口回调
			opts.close($this);
		}
		if (true === opts.closeTrue) {
			$this.destroy();
		}
	};
	//*************************************************************************************/
	// 自动关闭窗口
	dialog.prototype.autoClose = function() {
		var $this = this,
			opts = $this.options;
		if (opts.time > 0) {
			$this._closeTime = setTimeout(function() {
				$this.close();
			}, opts.time * 1000);
		}
	};
	//*************************************************************************************/
	// 设置窗口是否有滚动条
	dialog.prototype.setFix = function() {
		$('html').toggleClass('html-overflow', init.fix > 0);
	};
	//*************************************************************************************/
	// 检测当前窗口是否显示
	dialog.prototype.isShow = function() {
		return !this.elem.dialog.hasClass('vui-hide');
	};
	//*************************************************************************************/
	// 将窗口移动到最上层
	dialog.prototype.layerToTop = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options;
		// 模态窗口或者全屏窗口时不支持置顶操作
		// 窗口都是由父层窗口弹出的，模态窗口和全屏窗口被创建后必然没有其他同级窗口能被创建
		// 当前窗口已经置顶则不再执行以下函数
		if (false === opts.modal && false === opts.full) {
			$elem.wrap.on('mousedown', function() {
				if (opts.zIndex < init.zindex) {
					init.zindex++;
					opts.zIndex = init.zindex;
					$elem.dialog.css('zIndex', opts.zIndex);
				}
			});
		}
	};
	//*************************************************************************************/
	// 创建DOM对象
	dialog.prototype.create = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options;
		//*-------------------------------------------------------------*/
		// 第一层
		// 对话框抽象节点，负责全局定位
		// 保证相对屏幕位置[0,0]点
		$elem.dialog = $('<div class="vuidg-' + opts.theme + ' vui-hidden"></div>');
		//*-------------------------------------------------------------*/
		// 第二层
		// 对话框外包裹，显示节点
		$elem.wrap = $('<div class="vuidg-wrap"></div>').appendTo($elem.dialog);
		// 遮罩
		if (true === opts.modal) {
			$elem.overlay = $('<div class="vuidg-overlay"></div').appendTo($elem.dialog);
			$elem.overlayBg = $('<iframe class="vuidg-overlay-bg" frameborder="0"></iframe>').appendTo($elem.overlay);
			$elem.overlayInner = $('<div class="vuidg-overlay-inner"></div>').appendTo($elem.overlay);
			if (true === opts.overlayClose) {
				$elem.overlayInner.on('click', function() {
					$this.close();
				});
			}
		}
		//*-------------------------------------------------------------*/
		// 第三层
		// 拖拽手柄
		$elem.move = $('<div class="vuidg-move"></div>').appendTo($elem.wrap).hide();
		// 对话框内包裹
		$elem.inner = $('<div class="vuidg-inner"></div>').appendTo($elem.wrap);
		// 安全层
		$elem.wrapBg = $('<iframe frameborder="0" class="vuidg-wrap-bg"></iframe>').appendTo($elem.wrap);
		// 阴影
		if (true === opts.shade) {
			$elem.shade = $('<div class="vuidg-shade"></div>').appendTo($elem.wrap);
		}
		//*-------------------------------------------------------------*/
		// 第四层
		// 标题栏
		if (false !== opts.title) {
			$elem.title = $('<div class="vuidg-title"></div>').prependTo($elem.inner);
			// 标题文字
			$elem.titleText = $('<div class="vuidg-title-text">' + opts.title + '</div>').appendTo($elem.title);
			// 关闭按钮
			if (true === opts.titleClose) {
				$elem.titleClose = $('<div class="vuidg-title-close"></div>').on('click', function() {
					$this.close();
					//$this.hide();
				}).hover(function() {
					$(this).addClass('vuidg-title-close-hover');
				}, function() {
					$(this).removeClass('vuidg-title-close-hover');
				}).appendTo($elem.title);
			}
		}
		// 内容框
		$elem.content = $('<div>').addClass('vuidg-content').appendTo($elem.inner);
		// 内容
		switch (opts.type) {
		case 'text':
			$elem.text = $('<div>').addClass('vuidg-content-text').text(opts.body).appendTo($elem.content);
			break;
		case 'html':
			$elem.content.html(opts.body);
			break;
		case 'dom':
			$elem.content.append($(opts.body));
			break;
		case 'frame':
			$elem.iframe = $('<iframe class="vui-iframe" frameborder="0" src="' + opts.body + '" data-timestamp="' + $this.timestamp + '"></iframe>').appendTo($elem.content);
			break;
		}
		//*-------------------------------------------------------------*/
		// 按钮栏
		if (false !== opts.button) {
			$elem.buttonset = $('<div class="vuidg-button-wrap"></div>').appendTo($elem.inner);
			if (false === $.isEmptyObject(opts.button)) {
				$.each(opts.button, function(i, n) {
					var $button = $('<div class="vuidg-button">' + n.text + '</div>').on('click', function() {
						n.click($this);
					}).hover(function() {
						$(this).addClass('vuidg-button-hover');
					}, function() {
						$(this).removeClass('vuidg-button-hover');
					}).appendTo($elem.buttonset);
				});
			}
		}
		// 将DOM对象插入到BODY
		$elem.dialog.appendTo($elem.body);
	};
	//*************************************************************************************/
	dialog.prototype.updateSize = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options;
		if (true === opts.full) {
			// 窗口尺寸等于window尺寸
			$this.size.width = $elem.win.width();
			$this.size.height = $elem.win.height();
			$this.size.contentHeight = $this.size.height - $this.size.titleHeight - $this.size.buttonHeight;
		}
	};
	// 获取窗口尺寸
	// 初始化时，并且在隐藏前获取
	dialog.prototype.getSize = function() {
		// 设定
		// wrap|inner|content 三者宽度一致
		// wrap|inner 的高度等于 content+title+buttonset
		// wrap|inner|content 三者均无内、外补丁
		// wrap|content 二者无边框宽度
		// inner 边框由位置偏移矫正
		var $this = this,
			$elem = $this.elem,
			opts = $this.options;
		// 标题高度
		$this.size.titleHeight = false === opts.title ? 0 : $elem.title.outerHeight(true);
		// 按钮高度
		$this.size.buttonHeight = false === opts.button ? 0 : $elem.buttonset.outerHeight(true);
		// 非全屏时计算
		if (false === opts.full) {
			// 窗口宽度，保证wrap/inner/content三个对象宽度一致
			if (opts.size[0] === 'auto') {
				// 内容宽度 
				var contentWidth = $elem.content.width();
				// 窗口宽度为自动时，保证窗口宽度不能小于最小宽度
				$this.size.width = contentWidth < opts.minSize[0] ? opts.minSize[0] : contentWidth;
			} else {
				$this.size.width = opts.size[0];
			}
			// 窗口高度 wrap和inner高度相同，content高度等于wrap的高度减去标题和按钮高度
			if (opts.size[1] === 'auto') {
				// 内容高度
				var contentHeight = $elem.content.height()
				// 高度自动时，content的高度不能小于最小高度
				$this.size.contentHeight = contentHeight < opts.minSize[1] ? opts.minSize[1] : contentHeight;
			} else {
				// 指定高度时，content等于指定高度
				$this.size.contentHeight = opts.size[1];
			}
			// wrap的高度等于content高度、标题高度、按钮高度之和
			$this.size.height = $this.size.contentHeight + $this.size.titleHeight + $this.size.buttonHeight;
		}
	};
	//*************************************************************************************/
	// 获取窗口位置
	dialog.prototype.getPos = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options;
		if (true === opts.full) {
			$this.pos = {
				x: 0,
				y: 0
			};
		} else {
			if (opts.pos[0] === 'auto') {
				$this.pos.x = ($elem.win.width() - $this.size.width) / 2;
			} else {
				if (opts.pos[2] === 1 || opts.pos[2] === 4) {
					$this.pos.x = opts.pos[0];
				} else {
					$this.pos.x = $elem.win.width() - opts.pos[0] - $this.size.width;
				}
			}
			if (opts.pos[1] === 'auto') {
				$this.pos.y = ($elem.win.height() - $this.size.height) / 2;
			} else {
				if (opts.pos[2] === 1 || opts.pos[2] === 2) {
					$this.pos.y = opts.pos[1];
				} else {
					$this.pos.y = $elem.win.height() - opts.pos[1] - $this.size.height;
				}
			}
		}
	};
	//*************************************************************************************/
	// 设置窗口位置
	dialog.prototype.setPos = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options;
		var shadeBoder = (true === opts.shade ? opts.shadeBorder : 0) + opts.borderWidth;
		if (true === opts.full) {
			$this.pos = {
				x: 0,
				y: 0
			};
		} else {
			if (true === opts.range) {
				if ($this.pos.x + $this.size.width + shadeBoder > $elem.win.width()) {
					$this.pos.x = $elem.win.width() - ($this.size.width + shadeBoder);
				}
				if ($this.pos.y + $this.size.height + shadeBoder > $elem.win.height()) {
					$this.pos.y = $elem.win.height() - ($this.size.height + shadeBoder);
				}
				if ($this.pos.x < shadeBoder) {
					$this.pos.x = shadeBoder;
				}
				if ($this.pos.y < shadeBoder) {
					$this.pos.y = shadeBoder;
				}
			}
		}
		// 相对dialog的绝对定位
		$elem.wrap.css({
			left: $this.pos.x,
			top: $this.pos.y
		});
	};
	//*************************************************************************************/
	// 设置样式
	dialog.prototype.setStyle = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options,
			shadeBoder = (true === opts.shade ? opts.shadeBorder : 0) + opts.borderWidth;
		$elem.dialog.css({
			position: init.ie6 ? 'absolute' : 'fixed',
			zIndex: opts.zIndex,
			top: $this.offset.y,
			left: $this.offset.x
		});
		if (true === opts.modal) {
			$elem.overlay.css({
				width: $elem.win.width(),
				height: $elem.win.height()
			});
			$elem.overlayInner.css({
				backgroundColor: opts.overlayColor,
				opacity: opts.overlayOpacity
			});
		}
		$elem.wrap.css({
			width: $this.size.width,
			height: $this.size.height
		});
		if (true === opts.shade) {
			$elem.shade.css({
				top: -shadeBoder,
				left: -shadeBoder,
				width: $this.size.width + shadeBoder * 2,
				height: $this.size.height + shadeBoder * 2,
				backgroundColor: opts.shadeColor,
				opacity: opts.shadeOpacity
			});
		}
		$elem.wrapBg.css({
			top: -shadeBoder,
			left: -shadeBoder,
			width: $this.size.width + shadeBoder * 2,
			height: $this.size.height + shadeBoder * 2
		});
		$elem.inner.css({
			top: -opts.borderWidth,
			left: -opts.borderWidth,
			width: $this.size.width,
			height: $this.size.height,
			borderWidth: opts.borderWidth,
			borderColor: opts.borderColor,
			backgroundColor: opts.backgroundColor
		});
		$elem.move.css({
			top: -shadeBoder,
			left: -shadeBoder,
			width: $this.size.width,
			height: $this.size.height,
			borderWidth: shadeBoder
		});
		$elem.content.css({
			width: $this.size.width,
			height: $this.size.contentHeight
		});
		if (false !== opts.title && true === opts.draggable) {
			$elem.titleText.css('cursor', 'move');
		}
	};
	//*************************************************************************************/
	// 当窗口尺寸改变时触发事件
	dialog.prototype.onResize = function(e) {
		var $this = e.data.vui,
			$elem = $this.elem,
			opts = $this.options;
		if (true === init.ie6) {
			$this.onScroll(e);
		}
		var contentHeight, windowHeight, windowWidth;
		windowHeight = $elem.win.height();
		windowWidth = $elem.win.width();
		if (true === opts.full) {
			$elem.wrap.css({
				width: windowWidth,
				height: windowHeight
			});
			$elem.inner.css({
				width: windowWidth,
				height: windowHeight
			});
			$elem.wrapBg.css({
				width: windowWidth,
				height: windowHeight
			});
			contentHeight = windowHeight;
			contentHeight = false === opts.title ? contentHeight : contentHeight - $this.size.titleHeight;
			contentHeight = false === opts.button ? contentHeight : contentHeight - $this.size.buttonHeight;
			$elem.content.css({
				width: windowWidth,
				height: contentHeight
			});
		} else {
			if (true === opts.modal) {
				$elem.overlay.css({
					width: windowWidth,
					height: windowHeight
				});
			};
			$this.setPos();
		}
	};
	//*************************************************************************************/
	// 当滚动屏幕时触发事件
	dialog.prototype.onScroll = function(e) {
		var $this = e.data.vui,
			$elem = $this.elem,
			opts = $this.options;
		$this.offset.x = $elem.win.scrollLeft();
		$this.offset.y = $elem.win.scrollTop();
		$elem.dialog.css({
			left: $this.offset.x,
			top: $this.offset.y
		});
	};
	//*************************************************************************************/
	// 拖拽
	// 拖拽基于条件，必须options中拖拽开启，并且有标题栏
	dialog.prototype.draggable = function() {
		var $this = this,
			$elem = $this.elem,
			opts = $this.options,
			move = {
				start: { // 鼠标开始坐标
					x: 0,
					y: 0
				},
				offset: { //移动距离
					x: 0,
					y: 0
				},
				status: false
			};
		if (false === opts.draggable) {
			return;
		}
		var shadeBoder = (true === opts.shade ? opts.shadeBorder : 0) + opts.borderWidth;
		$elem.title.on('mousedown', function(e) {
			if ($(e.target).is($elem.titleText)) {
				e.preventDefault();
				move.status = true;
				move.start = {
					x: e.pageX,
					y: e.pageY
				};
				$elem.move.css({
					left: -shadeBoder,
					top: -shadeBoder
				}).show();
			}
		});
		$elem.doc.on('mouseup', function(e) {
			if (true === move.status) {
				$this.pos = {
					x: $this.pos.x + (e.pageX - move.start.x),
					y: $this.pos.y + (e.pageY - move.start.y)
				}
				$this.setPos();
				$elem.move.hide();
			}
			move.status = false;
		}).on('mousemove', function(e) {
			if (true === move.status) {
				e.preventDefault();
				move.offset = {
					x: e.pageX - move.start.x,
					y: e.pageY - move.start.y
				};
				if (true === opts.range) {
					if (move.offset.x + $this.pos.x + $this.size.width + shadeBoder > $elem.win.width()) {
						move.offset.x = $elem.win.width() - $this.pos.x - $this.size.width - shadeBoder;
					}
					if (move.offset.y + $this.pos.y + $this.size.height + shadeBoder > $elem.win.height()) {
						move.offset.y = $elem.win.height() - $this.pos.y - $this.size.height - shadeBoder;
					}
					if (move.offset.x + $this.pos.x < shadeBoder) {
						move.offset.x = shadeBoder - $this.pos.x;
					}
					if (move.offset.y + $this.pos.y < shadeBoder) {
						move.offset.y = shadeBoder - $this.pos.y;
					}
				}
				$elem.move.css({
					left: move.offset.x - shadeBoder,
					top: move.offset.y - shadeBoder
				});
			}
		});
	};
	//*************************************************************************************/
})(jQuery);