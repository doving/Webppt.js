(function(){

	function _($){
		function Webppt(option){
			option = {
				thumbnail: "#thumbnail",
				tool: "#tool",
				ppt:"#ppt"
			};
			this.option = option;
			this.$tool = $(option.tool);
			this.$ppt = $(option.ppt);
			this.$thumbnail = $(option.thumbnail);
			this.currentIndex = 0;
			this.data = [];
		}
		Webppt.prototype.initEditor = function(){
			if(this.option.tool){
				var $text = $("<input type='button' value='文本框' />").css({
					position:"absolute",
					left: "10px",
					top: "10px",
					height:"30px",
					width:"80px"
				});
				
				var $imginput = $("<input type='file' />").css({
					position:"absolute",
					left: "100px",
					top: "10px",
					height: "30px",
					width: "80px",
					visibility: "hidden"
				});

				var $img = $("<input type='button' value='图片' />").css({
					position:"absolute",
					left: "100px",
					top: "10px",
					height:"30px",
					width:"80px"
				});
				this.$tool.append($text).append($imginput).append($img);

				var self = this;
				$text.on("click",function(){
					var element = new Element("text").decrate();
					self.$ppt.append(element.$);
				});
				$img.on("click",function(){
					$imginput.click();
				});
				$imginput.on("change",function(){
					var url; 
					if (navigator.userAgent.indexOf("MSIE")>=1) {
						url = this.value; 
					}else{
						url = window.URL.createObjectURL(this.files.item(0)); 
					} 
					self.$ppt.append(new Element("img", {url:url,height:100,width:100}).decrate().$);
				});

			}
		}
		Webppt.prototype.remove = function(index){
			this.data.splice(index,1);
		}
		Webppt.prototype.add = function(ppt){
			this.data.push(ppt);
		}
		
		function ppt(){
			this.elements = [];
		}

		function Decration(name,element){
			var $dec = $("<div style='position:absolute;'></div>");
			if(name.length === 1){
				$dec.css({"cursor":"move","-moz-user-select": "none", "-webkit-user-select": "none","-ms-user-select": "none"});
				switch(name){
					case 't':
						this.$ = $dec.css({left:0,top:0,width:"100%",height:"4px",borderTop:"dashed 1px #ccc"});
						break;
					case 'r':
						this.$ = $dec.css({right:0,top:0,height:"100%",width:"4px",borderRight:"dashed 1px #ccc"});
						break;
					case 'b':
						this.$ = $dec.css({bottom:0,left:0,width:"100%",height:"4px",borderBottom:"dashed 1px #ccc"});
						break;
					case 'l':
						this.$ = $dec.css({left:0,top:0,height:"100%",width:"4px",borderLeft:"dashed 1px #ccc"});
						break;
				}
			}else{
				$dec.css({width:"5px",height:"5px",margin:"auto",border:"solid 1px #ccc"});
				switch(name){
					case 'lt':
						this.$ = $dec.css({left:"-3px",top:"-3px",cursor:"nw-resize"});
						break;
					case 'mt':
						this.$ = $dec.css({left:0,right:0,top:"-3px",cursor:"n-resize"});
						break;
					case 'rt':
						this.$ = $dec.css({right:"-3px",top:"-3px",cursor:"ne-resize"});
						break;
					case 'lm':
						this.$ = $dec.css({left:"-3px",top:0,bottom:0,cursor:"w-resize"});
						break;
					case 'rm':
						this.$ = $dec.css({right:"-3px",top:0,bottom:0,cursor:"e-resize"});
						break;
					case 'lb':
						this.$ = $dec.css({left:"-3px",bottom:"-3px",cursor:"sw-resize"});
						break;
					case 'mb':
						this.$ = $dec.css({bottom:"-3px",left:0,right:0,cursor:"s-resize"});
						break;
					case 'rb':
						this.$ = $dec.css({right:"-3px",bottom:"-3px",cursor:"se-resize"});
						break;
				}
			}
			
			this.name    = name;
			this.element = element;
			this.element.$.append(this.$);
			this.canMove = false;		
		}

		Decration.prototype.bindEvent = function(){
			var self = this;
			self.$.on("mousedown",function(e){
				self.canMove = true;
				self.element.isSelected = true;
				self.ex = e.pageX;
				self.ey = e.pageY;
			})

			$(document).on("mouseup",function(){
				self.canMove = false;
			}).on("mousemove",function(e){
				if(self.canMove){
					var x = e.pageX,
						y = e.pageY;
					self.move(x-self.ex, y-self.ey);
					self.ex = x;
					self.ey = y;
				}
			});
			return this;
		}

		Decration.prototype.move = function(dx, dy){
			//上下左右拖动
			if(/^[trbl]$/.test(this.name)){
				this.element.move(dx, dy);
			}
			//上下缩放
			if(/^m[tb]$/.test(this.name)){
				this.element.scale(0, dy, this.name);
			}
			//左右缩放
			if(/^[lr]m$/.test(this.name)){
				this.element.scale(dx, 0, this.name);
			}
			//四个角自由缩放
			if(/^(lt)|(rt)|(lb)|(rb)$/.test(this.name)){
				this.element.scale(dx, dy, this.name);
			}
		}

		function Element(name, imgobj){
			this.text = "";
			this.name = name;
			this.canMove = false;
			if(name === 'text'){
				this.$content = $("<div contenteditable=true></div>").css({
					outline:"none",
					position:"absolute",
					top:"5px",
					left:"5px",
					right:"5px",
					bottom:"5px",
					wordBreak:"break-all"
				});
			}
			if(name === 'img'){
				this.$content = $("<img src='"+imgobj.url+"'/>").css({
					outline:"none",
					height: "100%",
					width: "100%"
				});
			}
			this.$ = $("<div></div>").css({
				//overflow:"hidden",
				padding:"5px",
				position:"absolute",
				height:30,
				width:200,
				left:10,
				top:10
			}).append(this.$content);
			this.isSelected = false;
			this.decrations = [];
			//this.$.css({"position": "absolute","border": "1px solid #ccc"});
		}
		Element.prototype.decrate = function(){
			var arr = ['t', 'r', 'b', 'l', 'lt', 'mt', 'rt', 'lm', 'rm', 'lb', 'mb', 'rb'];
			var self = this;
			$.each(arr,function(i, v){
				self.decrations.push(new Decration(v, self).bindEvent());
			});
			/*$(document).on("click",function(e){
				var target = e.target;
				var arr = self.decrations.concat({$:self.$content});
				for(var i = 0; i < arr.length; i++){
					if(target === arr[i].$[0]){
						self.showDec();
						return;
					}
				}
				self.hideDec();				
			});*/
			return this;
		}
		Element.prototype.showDec = function(){
			$.each(this.decrations,function(){
				this.$.show();
			});
			return this;
		}
		Element.prototype.hideDec = function(){
			$.each(this.decrations,function(){
				this.$.hide();
			});
			return this;
		}
		Element.prototype.remove = function(){
			this.$.remove();
			return this;
		}
		Element.prototype.move = function(dx, dy){
			var x = parseFloat(this.$.css("left")),
				y = parseFloat(this.$.css("top"));
			this.$.css({left:x+dx, top:y+dy});
			return this;
		}

		Element.prototype.scale = function(dx, dy, name){
			var w = this.$.width(),
				h = this.$.height();
			if(/^(lt)|(mt)|(lm)$/.test(name)){
				if(w-dx <= 0)dx = 0;
				if(h-dy <= 0)dy = 0;
				this.move(dx, dy);
				dx *= -1;
				dy *= -1;
			}
			if('lb' == name){
				if(w-dx <= 0)dx = 0;
				this.move(dx, 0);
				dx *= -1;
			}
			if('rt' == name){
				if(h-dy <= 0)dy = 0;
				this.move(0, dy);
				dy *= -1;
			}
			this.$.width(w + dx);
			this.$.height(h + dy);
			return this;
		}

		$.Webppt = function(option){
			var wp = new Webppt(option);
			wp.initEditor();
		};
	}

		
		
	//cmd规范写法
	if(typeof define === "function" && typeof define.cmd === "object"){
		define(['jquery'],function(require, exports, module){
			_(require("jquery"));
		});
	//amd规范写法
	}else if(typeof define === "function" && typeof define.amd === "object"){
		define(['jquery'],_);
	//普通写法
	}else{
		if("undefined" === jQuery){
			throw new Error("superDrag requires jQuery");
		}
		_(jQuery);
	}
})()