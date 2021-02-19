(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{379:function(v,_,t){"use strict";t.r(_);var e=t(41),D=Object(e.a)({},(function(){var v=this,_=v.$createElement,t=v._self._c||_;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("h1",{attrs:{id:"_17-dav中的xml可扩展性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_17-dav中的xml可扩展性"}},[v._v("#")]),v._v(" 17. DAV中的XML可扩展性")]),v._v(" "),t("p",[v._v("在本规范中使用XML名称空间扩展名（[REC-XML-NAMES]），以允许添加新的XML元素而不必担心与其他元素名称冲突。尽管WebDAV请求和响应主体可以由任意XML元素进行扩展，而消息接收者也可以忽略它们，但是除非被明确定义在IETF RFC中并由WebDAV工作组审查通过，否则不应在其它XML元素上使用“DAV:”命名空间。")]),v._v(" "),t("p",[v._v("为了使WebDAV既可扩展又可向后兼容，客户端和服务器都需要知道在接收到意外的或无法识别的命令扩展时该怎么办。先说XML处理过程，客户端和服务器在遇到这些预期之外的元素和属性（以及所有此类子元素）时要当它们不存在。非预期的元素或属性可能在其他上下文中有用但是在这里没有用。当然，在处理时忽略此类项目与同时记录这些信息供调试并不冲突。")]),v._v(" "),t("p",[v._v("此约束还适用于客户端处理DAV属性值的情况，除非属性的schema另行声明，否则应忽略非预期的XML元素。")]),v._v(" "),t("p",[v._v("此约束不适用于服务器设置DAV死属性时被要求同时必须记录所有XML元素的情况。")]),v._v(" "),t("p",[v._v("此外，此约束不适用于作为实体内容的XML，例如，客户端PUT了一个XML文档要求服务器保存。")]),v._v(" "),t("p",[v._v("收件人应忽略XML中的处理指令。因此，WebDAV的扩展规范不应使用处理指令来定义规范行为。")]),v._v(" "),t("p",[v._v("本规范中定义的所有XML元素都包含XML DTD片段。但是，由于命名空间的使用和扩展规则的存在，在WebDAV看来是正确的XML依据DTD标准可能是无效的。尤其是以下情况：")]),v._v(" "),t("ul",[t("li",[v._v("位于“DAV:”命名空间中的元素，")]),v._v(" "),t("li",[v._v("除非另有说明，否则元素顺序无关紧要，")]),v._v(" "),t("li",[v._v("可以添加扩展属性，")]),v._v(" "),t("li",[v._v("对于“ANY”的元素类型定义，该元素的规范文本定义了其中可以有什么及其含义。")]),v._v(" "),t("li",[v._v("对于“#PCDATA”的元素类型定义，不得添加扩展元素。")]),v._v(" "),t("li",[v._v("对于包括“EMPTY”在内的其他元素类型，可以添加扩展元素。")]),v._v(" "),t("li",[v._v("请注意，包含元素的元素不能扩展为包含文本，反之亦然。")])]),v._v(" "),t("p",[v._v("通过上述规则放宽了DTD验证后，DTD片段描述的约束就是强制性的了（参见附录A）。具有XML主体的WebDAV消息的接收者就不能再根据其它任何硬编码或动态声明的DTD来验证XML文档。\n请注意，本节描述了向后兼容的扩展性规则。有时也可能会将扩展设计为不向后兼容，例如，定义一个扩展来复用本文档中定义的XML元素内容，但是忽略其中DTD所需的子元素。")])])}),[],!1,null,null,null);_.default=D.exports}}]);