(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{381:function(t,_,e){"use strict";e.r(_);var a=e(41),v=Object(a.a)({},(function(){var t=this,_=t.$createElement,e=t._self._c||_;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"_20-安全性考量"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20-安全性考量"}},[t._v("#")]),t._v(" 20. 安全性考量")]),t._v(" "),e("p",[t._v("提供本节的内容是为了详细说明有关WebDAV应用程序需要注意的安全性问题。")]),t._v(" "),e("p",[t._v("HTTP/1.1（在[RFC2616]中讨论）和XML（在[RFC3023]中讨论）的所有安全考虑因素也适用于WebDAV。此外，远程创作固有的安全风险要求使用更强大的身份验证技术，它引入了一些新的隐私问题，并可能增加不良的服务器设计带来的危害。这些问题在下面详细介绍。")]),t._v(" "),e("h2",{attrs:{id:"_20-1-客户端身份验证"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20-1-客户端身份验证"}},[t._v("#")]),t._v(" 20.1 客户端身份验证")]),t._v(" "),e("p",[t._v("由于WebDAV服务器着重于创作，因此需要使用身份验证技术来不仅保护对网络资源的访问，而且还保护资源的完整性。此外，锁定功能的引入也要求支持身份验证。")]),t._v(" "),e("p",[t._v("通过不安全的通道以明文形式发送密码是一种不足的方法，无法保护资源的可访问性和完整性，因为密码可能会被截获。由于HTTP/1.1的Basic身份验证本质上执行密码的明文传输，因此除非连接本身是安全的(https)，否则Basic身份验证不得用于WebDAV客户端向服务器进行验证。此外，除非连接是安全的(https)，否则WebDAV服务器不得在WWW-Authenticate header中发送基本身份验证质询。安全连接的一个示例是采用强密码套件和服务器身份验证的传输层安全性（TLS）连接。\nWebDAV应用程序必须支持Digest身份验证方案[RFC2617]。由于Digest身份验证可以通过只有通信双方才知道的共享秘钥来对内容实现验证，而不必明文发送秘钥，因此Digest身份验证避免了Basic身份验证固有的安全性问题，同时提供了可用于广泛范围的身份验证级别场景范围。")]),t._v(" "),e("h2",{attrs:{id:"_20-2-拒绝服务-dos"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20-2-拒绝服务-dos"}},[t._v("#")]),t._v(" 20.2 拒绝服务(DOS)")]),t._v(" "),e("p",[t._v("拒绝服务攻击是WebDAV服务器特别需要关注的问题。 WebDAV加HTTP(这种机制)导致他人有可能对系统资源的每个部分进行拒绝服务攻击。")]),t._v(" "),e("p",[t._v("存储空间可能会被使用PUT超大文件的方式而攻击。")]),t._v(" "),e("p",[t._v("要求对一个超大型集合进行递归操作可能会攻击服务器的处理性能。")]),t._v(" "),e("p",[t._v("使用多连接发出大量流水线请求可能会瘫痪网络连接。")]),t._v(" "),e("p",[t._v("WebDAV服务器需要重视被所有级别的拒绝服务攻击的可能性。应对此类攻击的正确响应可以是简单地断开连接，或者服务器可以使用400级别的状态请求例如400（错误请求）来回应攻击并指出请求被拒绝的原因（500级别的状态响应将表明问题在于服务器，而客户端可以补救无意的DoS攻击）。")]),t._v(" "),e("h2",{attrs:{id:"_20-3-通过隐蔽性实现安全"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20-3-通过隐蔽性实现安全"}},[t._v("#")]),t._v(" 20.3 通过隐蔽性实现安全")]),t._v(" "),e("p",[t._v("WebDAV通过PROPFIND方法提供了一种机制，用于列出集合的成员资源。这大大降低了（仅靠增加发现网络资源名称难度来实现）安全或隐私技术的有效性。因此必须鼓励WebDAV服务器使用访问控制技术来防止对资源的不必要访问，而不是依赖于其资源名称的相对模糊性。")]),t._v(" "),e("h2",{attrs:{id:"_20-4-与锁相关的隐私问题"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20-4-与锁相关的隐私问题"}},[t._v("#")]),t._v(" 20.4 与锁相关的隐私问题")]),t._v(" "),e("p",[t._v("在提交锁定请求时，用户代理还可以提交一个“owner” XML字段，该字段提供了有关获得锁定的人的联系信息（对于那些由人而不是机器人进行锁定的情况）。此联系信息存储在资源上的DAV:lockdiscovery属性中，其他协作者可以使用该联系信息开始协商对资源的访问。但是，在许多情况下，此联系信息可能是非常私人的，因此不应广泛传播。服务器应适当地限制对DAV:lockdiscovery属性的读取访问。此外，用户代理应提供对是否要发送联系信息的控制，如果发送了联系信息，则应控制确切发送的信息内容。")]),t._v(" "),e("h2",{attrs:{id:"_20-5-与属性有关的隐私问题"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20-5-与属性有关的隐私问题"}},[t._v("#")]),t._v(" 20.5 与属性有关的隐私问题")]),t._v(" "),e("p",[t._v("由于属性值通常用于保存诸如文档作者之类的信息，因此存在由于对资源属性数据的广泛访问而引起隐私问题的可能性。为了减少通过属性意外释放私人信息的风险，鼓励服务器开发访问控制机制，以分离对资源内容的读取访问和对资源属性的读取访问。这允许用户控制其属性数据的分发，而不会过度限制对资源内容的访问。")]),t._v(" "),e("h2",{attrs:{id:"_20-6-xml实体的含义"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20-6-xml实体的含义"}},[t._v("#")]),t._v(" 20.6 XML实体的含义")]),t._v(" "),e("p",[t._v("XML支持[REC-XML]的第4.2.2节中定义的称为“external entities”的功能，该功能指示XML处理器检索并包含其他XML。外部XML实体可用于附加或修改与XML文档关联的文档类型声明（DTD）。外部XML实体也可以用于将XML包含在XML文档的内容中。对于非验证XML（例如本规范中使用的XML），XML不需要包含外部XML实体。但是，XML确实声明XML处理器可以自行决定去包含外部XML实体。")]),t._v(" "),e("p",[t._v("外部XML实体没有固有的可信赖性，并且易受HTTP GET请求的攻击。此外，在最坏的情况下，外部XML实体可能会修改DTD，从而影响XML文档的最终形式，从而严重修改其语义或使XML处理器暴露于[RFC3023]中讨论的安全风险。因此，实现者必须意识到外部XML实体应被视为不可信任。如果服务器选择不处理外部XML实体，则服务器应使用“no-external-entities”条件代码响应包含外部实体的请求。")]),t._v(" "),e("p",[t._v("如果一个广泛部署的应用程序使用外部XML实体，还会有伴随而来的可伸缩性风险。在这种情况下，可能会有大量的请求请转移到一个外部XML实体，这可能会使承担该外部XML实体资源请求的服务器超载。")]),t._v(" "),e("p",[t._v("此外，根据[REC-XML]的第4.2.2节中定义的“internal entities”评估，也存在风险。使用一个精心设计的小型嵌套内部实体请求就能产生海量的内存和/或处理资源消耗。服务器实现者应意识到这种风险，并配置其XML解析器，以便可以尽早检测到并拒绝此类请求。")]),t._v(" "),e("h1",{attrs:{id:"_20-7-与锁定令牌有关的风险"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20-7-与锁定令牌有关的风险"}},[t._v("#")]),t._v(" 20.7 与锁定令牌有关的风险")]),t._v(" "),e("p",[t._v("本规范鼓励对锁令牌（第6.5节）使用“通用唯一标识符（UUID）URN命名空间”（[RFC4122]），以确保其在空间和时间上的唯一性。版本1的UUID（在第4节中定义）可能包含一个“node”字段，该字段包含一个IEEE 802 MAC地址，通常是主机地址，对于具有多个IEEE地址的系统，使用任何一个都可以。由于WebDAV服务器将在其整个生命周期内发出许多锁，因此这意味着它也可能暴露其IEEE802地址。")]),t._v(" "),e("p",[t._v("由于IEEE802地址的暴露存在若干风险。使用IEEE802地址：")]),t._v(" "),e("ul",[e("li",[t._v("可以跟踪硬件在子网之间的移动。")]),t._v(" "),e("li",[t._v("可能可以确定运行WebDAV服务器的硬件的制造商。")]),t._v(" "),e("li",[t._v("可以确定运行WebDAV的每种计算机的数量。")]),t._v(" "),e("li",[t._v("此风险仅适用于基于主机地址的UUID版本。[RFC4122]的第4节描述了几种其他的生成UUID的机制，这些机制不涉及主机地址，因此不会遭受这种风险。")])]),t._v(" "),e("h2",{attrs:{id:"_20-8-托管恶意内容"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_20-8-托管恶意内容"}},[t._v("#")]),t._v(" 20.8 托管恶意内容")]),t._v(" "),e("p",[t._v("HTTP能够托管在客户端计算机上执行的程序。这些程序可以采用多种形式，包括Web脚本，可执行文件，插件模块和文档中的宏。 WebDAV不会改变围绕这些程序的任何安全性问题，但是WebDAV通常用于范围广泛的用户可以在服务器上发布文档的环境中。服务器可能与发布文档的作者没有紧密的信任关系。允许客户端发布任意内容的服务器可以有效地采取预防措施，以检查发布到服务器的内容是否对其他客户端无害。服务器可以通过诸如限制允许发布的内容类型以及在发布的内容上运行病毒和恶意软件检测软件的技术来做到这一点。服务器还可以通过具有适当的访问限制和对允许向服务器发布内容的用户进行身份验证的方式来降低风险。")])])}),[],!1,null,null,null);_.default=v.exports}}]);