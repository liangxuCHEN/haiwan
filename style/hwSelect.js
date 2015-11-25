//生成数量下拉框
(function (window,$) {
    function HwSelect(opt) {
        this.settings = {};
        this.selectedData = {};
        this.templateData = {};
        this.defaultValue = "";
        //根据值，查找对应的id
        this.templateValData = {};
        this.namespace = "";
        this.formatResult = function (result) {
            return result;
        };
        $.extend(this,opt);
    }

    HwSelect.prototype= {
        createList : function (data) {
            var listHtml = ['<ul class="select_option">'];
            for(var i = 0; i < data.length; i++){
                var result = data[i];
                var selectId = this.namespace + (this.namespace == "" ? "" : "-") + "hwselect-result-" + i;
                if(result instanceof Object && "id" in result){
                    this.templateData[selectId] = result;
                    this.templateValData[result.id] = selectId;
                } else {
                    this.templateData[selectId] = result;
                    this.templateValData[result] = selectId;
                }
                listHtml.push('<li id="'+selectId+'" >'+this.formatResult(result));
            }
            listHtml.push("</ul>");
            return listHtml.join("");
        },
        getSelectedVal : function (templateObject) {
            if(templateObject instanceof Object && "id" in templateObject){
                return templateObject.id;
            }
            return templateObject;
        },
        blindEvent : function () {
            var settings = this.settings;
            var _this = this;
            settings.$inputVal.on("click",function () {
                _this.open();
            });
            settings.$wrap.on("mouseleave",function () {
                _this.close();
            });
            settings.$listChildren.each(function () {
                $(this).on("click",function () {
                    var selectedVal = _this.getSelectedVal(_this.templateData[$(this).attr("id")]);
                    if(selectedVal != settings.$element.val()){
                        settings.$list.find(".hover").removeClass("hover");
                        settings.$inputVal.find("p").html($(this).html());
                        $(this).addClass("hover");
                        //_this.selectedData.index = settings.$listChildren.index(this);
                        _this.selectedData.val = selectedVal;
                        _this.change(selectedVal,_this.templateData[$(this).attr("id")],settings.$element.attr("id"));
                        settings.$element.val(selectedVal);
                    }
                    settings.$list.hide();
                });
            });

        },
        open : function () {
            this.settings.$list.show();
        },
        close : function () {
            this.settings.$list.hide();
        },
        /**
         * 格式化显示选中在输入框的值
         * @param value
         * @returns {*}
         */
        formatValue : function (value) {
            var formatVal = this.templateData[this.templateValData[value]];
            return this.formatResult(formatVal);
        },
        init : function () {
            var _this = this;
            var inputWidth = _this.$element.width();
            var $element = _this.$element;
            var selectedVal = _this.$element.val();
            selectedVal = (selectedVal != "" ? selectedVal : _this.defaultValue);
            $element.hide()
                .wrap("<div class='select_wrap hwselect_"+this.namespace+"' ></div>")
                .after(_this.createList(_this.data))
                .before('<div class="s_date"><p>'+ _this.formatValue(selectedVal) +'</p></div>')
                .prev()
                .css("width",inputWidth);
            var selectWidth = $element.prev().innerWidth();
            $element.next()
                .css("width",selectWidth)
                .children()
                .css("width",selectWidth);

            _this.$inputVal = $element.prev();
            _this.$list = $element.next();
            _this.$wrap = $element.parent();
            _this.$listChildren =  _this.$list.children();
            $.extend(_this.settings,_this);
            this.selectedData.val = selectedVal;
            if(this.defaultValue != ""){
                //有默认值
                $element.val(selectedVal);
            }
            var index = null;
            _this.$listChildren.each(function () {
                if($(this).attr("id") == _this.templateValData[selectedVal]){
                    index = _this.$listChildren.index(this);
                    $(this).addClass("hover");
                    return false;
                }
            });
            //this.selectedData.index = index;

            this.blindEvent();
        }
    };

    $.fn.hwSelect = function () {
        var opt,
            args = Array.prototype.slice.call(arguments, 0);
        if (args.length === 0 || typeof(args[0]) === "object") {
            opt = args.length === 0 ? {} : $.extend({}, args[0]);
            opt.$element = $(this);
            var hwSelect = new HwSelect(opt);
            hwSelect.init();
        }
    };

}(window,$));