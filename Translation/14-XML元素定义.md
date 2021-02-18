# 14. XML元素定义

在本节中，每节的最后一行使用[REC-XML]中定义的格式给出元素类型声明。 “value”字段（如果存在）使用BNF来对XML元素的允许内容进行限制（即进一步限制PCDATA元素的值）。 请注意，此处定义的所有元素都可以根据第17节中定义的规则进行扩展。此处定义的所有元素都在“ DAV:”命名空间中。

## 14.1 activelock

Name: activelock

Purpose: 描述一个资源上的锁

<!ELEMENT activelock (lockscope, locktype, depth, owner?, timeout?, locktoken?, lockroot)>

## 14.2 allprop

Name: allprop

Purpose: 定义要请求所有死属性和此文档中规定且存在于资源之上的活属性

<!ELEMENT allprop EMPTY >

## 14.3 collection

Name: collection

Purpose: 描述相关资源是一个集合，一个集合资源的DAV:resourcetype属性必须包含它，它通常是空值单也可以扩展加入子元素。

<!ELEMENT collection EMPTY > 

## 14.4 depth

Name: depth

Purpose: 用来在XML内容中表示深度的值，比如LOCK信息就需要

Value: "0" | "1" | "infinity"

<!ELEMENT depth (#PCDATA) >

## 14.5 error

Name: error

Purpose: 错误响应，尤其是“403禁止”和“409冲突”，有时需要更多信息来指示出了什么问题。在这些情况下，服务器可能会返回带有“error”文档元素的XML响应body，其中包含标识特定条件代码的子元素。

Description: 包含至少一个XML元素，并且不得包含文本或混合内容。 作为“error”元素的子元素的任何元素都被视为前提条件或后置条件代码。 无法识别的元素必须被忽略。

<!ELEMENT error ANY >

## 14.6 exclusive

Name: exclusive

Purpose: 描述一个排它锁

<!ELEMENT exclusive EMPTY >

## 14.7 href

Name: href

Purpose: 必须包含一个 url 或者相对路径

Description: 取决于其使用的上下文，“href”的值可能有限制。 请参阅有使用“href”部分的规范内容，以明确每种情况下适用的限制。

Value: Simple-ref

<!ELEMENT href (#PCDATA)>

## 14.8 include

Name: include

Purpose: 子元素都代表了一个要包含在PROPFIND响应中的属性的名称。“include” XML元素内的所有子元素必须定义与资源相关的属性，尽管可能的属性名称不可能局限于本文档或其他标准中定义的那些属性名称。 该元素不能包含文本或混合内容。

<!ELEMENT include ANY >

## 14.9 location

Name: location

Purpose: HTTP定义了“location” header（请参阅[RFC2616]，第14.30节），用于某些状态代码（例如201和300系列代码）。 在“multistatus”元素内使用这些代码时，“location”元素可用来起到提供每个资源各自Location header的作用。

Description: 包含一个href元素，该元素具有与Location标头中使用的值相同的值。

<!ELEMENT location (href)>

## 14.10 lockentry

Name: lockentry

Purpose: 定义了此资源可以使用的锁的类型

<!ELEMENT lockentry (lockscope, locktype) >

## 14.11 lockinfo

Name: lockinfo

Purpose: “lockinfo” XML元素与LOCK方法一起使用，以指定客户端希望创建的锁的类型。

<!ELEMENT lockinfo (lockscope, locktype, owner?)  >

## 14.12 lockroot

Name: lockroot

Purpose: 包含锁的根URL，该根URL是在LOCK请求中通过其寻址资源的URL。

Description: href元素包含了锁根。服务器应在所有DAV:lockdiscovery属性值和对LOCK请求的响应中包括此值。<!ELEMENT lockroot (href) >

## 14.13 lockscope

Name: lockscope

Purpose: 定义锁是一个排它锁还是共享锁

<!ELEMENT lockscope (exclusive | shared) >

## 14.14 locktoken

Name: locktoken

Purpose: 锁的令牌token

Description: href包含了一个锁令牌URI，指向一个锁

<!ELEMENT locktoken (href) >

## 14.15 locktype

Name: locktype

Purpose: 指定了锁的权限类型，目前只有写入锁这一种类型

<!ELEMENT locktype (write) >

## 14.16 multistatus

Name: multistatus

Purpose: 包含了多状态返回的response消息

Description: 顶层的“responsedescription”元素用于提供描述响应总体性质的一般消息。如果此值可用，则应用程序可以使用它而不是显示响应中包含的各个响应描述。

<!ELEMENT multistatus (response*, responsedescription?)  >

## 14.17 owner

Name: owner

Purpose: 包含了客户端提供的锁持有人信息

Description: 允许客户端提供足以直接联系锁主体（例如电话号码或电子邮件URI），或发现锁主体（例如主页的URL）的信息。保存此信息时，客户端所提供的值必须视为死属性来处理， 除非客户端提供的所有者值为空，否则服务器不得更改该值。为了使不同客户端实现之间具有一定程度的互操作性，如果客户端具有适用于用户显示的锁创建者的URI格式的联系信息，则客户端应将这些URI放入“owner”元素的“href”子元素中。

Extensibility: 可以扩展子元素，混合内容，文本内容或属性。

## 14.18 prop

Name: prop

Purpose: 包含了此资源相关的属性

Contains properties related to a resource.

Description: 资源上定义的属性的通用容器。 “prop”元素内的所有子元素必须定义与资源相关的属性，尽管可能的属性名称绝不局限于本文档或其他标准中定义的那些属性名称。该元素不能包含文本或混合内容。

<!ELEMENT prop ANY >

## 14.19 propertyupdate

Name: propertyupdate

Purpose: 包含更改资源属性的请求。

Description: 此XML元素是用于修改资源属性的信息的容器。

<!ELEMENT propertyupdate (remove | set)+ >

## 14.20 propfind

Name: propfind

Purpose: 指定要从PROPFIND方法返回的属性。为“propfind”指定了四个特殊元素：“prop”，“allprop”，“include”和“propname”。如果在'propfind'内部使用'prop'，则它不得包含属性值。

<!ELEMENT propfind ( propname | (allprop, include?) | prop ) >

## 14.21 propname

Name: propname

Purpose: 指定仅返回资源上属性名称的列表。

<!ELEMENT propname EMPTY >

## 14.22 propstat

Name: propstat

Purpose: 将与特定“href”元素关联的prop和status元素分组在一起。

Description: propstat XML元素下必须包含一个prop XML元素和一个status XML元素。 prop XML元素的内容必须仅列出与status元素中请求的结果相对应属性的名称。可选的precondition/postcondition元素和“responsedescription”文本也适用于以“prop”命名的属性。

<!ELEMENT propstat (prop, status, error?, responsedescription?) >

## 14.23 remove

Name: remove

Purpose: 列出要从资源删除的属性

Description: Remove指示应删除prop中指定的属性。指定删除不存在的属性不是错误。 “remove” XML元素内的“prop”元素必须为空，因为仅需要知道要删除的属性名称就够了。

<!ELEMENT remove (prop) >

## 14.24 response

Name: response

Purpose: 保存了一个单独response的描述，其中包含了操作的影响结果和/或者它的属性。

Description: 当在“response”容器中使用时，“href”元素包含指向WebDAV资源的HTTP URL。每个“href”值不能作为“multistatus”元素下“response”的子元素出现多次。为了控制处理成本并以线性时间进行相应，此要求是必需的。本质上，这避免了因为想通过“href”将所有响应组合在一起而进行的搜索。但是，对于基于“href”值的排序没有任何要求。可选的precondition/postcondition元素和“responsedescription”文本可以提供有关此资源相对于请求或结果的其他信息。

<!ELEMENT response (href, ((href*, status)|(propstat+)), error?, responsedescription? , location?) >

## 14.25 responsedescription

Name: responsedescription

Purpose: 包含有关多状态中状态响应的信息。

Description: 提供适合呈现给用户的信息。

<!ELEMENT responsedescription (#PCDATA) >
## 14.26 set

Name: set

Purpose: 列出要为资源设置的属性值。

Description: “set”元素必须仅包含“prop”元素。 “set”元素内的“prop”元素包含的元素必须用来指定在Request-URI标识的资源上设置的属性的名称和值。如果属性已经存在，则其值将被替换。出现在'prop'元素范围内的语言标记信息（在“xml:lang”属性中，如果存在的话）必须与属性一起永久存储，并且随后必须使用PROPFIND进行检索。

<!ELEMENT set (prop) >

## 14.27 shared

Name: shared

Purpose: 描述一个共享锁

<!ELEMENT shared EMPTY >

## 14.28 status

Name: status

Purpose: 保留一个HTTP状态行。

Value: status-line (defined in Section 6.1 of [RFC2616])

<!ELEMENT status (#PCDATA) >

## 14.29 timeout

Name: timeout

Purpose: 一个锁过期前经过的秒数

Value: TimeType (defined in Section 10.7)

<!ELEMENT timeout (#PCDATA) >

## 14.30 write

Name: write

Purpose: 描述一个写入锁

<!ELEMENT write EMPTY >