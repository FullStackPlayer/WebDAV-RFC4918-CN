# 10. WebDAV的HTTP报头

所有DAV headers都遵循与HTTP headers相同的基本格式规则。比如行连续性以及如何使用逗号组合（或分离）同一标头的多个实例。

WebDAV向HTTP定义的集合中添加了两个新的条件header：If和Overwrite。

## 10.1 DAV Header
~~~text
DAV              = "DAV" ":" #( compliance-class ) 
compliance-class = ( "1" | "2" | "3" | extend ) 
extend           = Coded-URL | token 
                   ; token 在 RFC 2616, Section 2.2 中定义
Coded-URL        = "<" absolute-URI ">" 
                   ; 不允许线性空格（LWS）
                   ; absolute-URI 在 RFC 3986, Section 4.3 中定义
~~~

这个header出现在响应中表示该资源支持本规范所指定的DAV模式和协议。所有符合DAV标准的资源必须在所有OPTIONS响应上返回兼容级别为“1”的DAV标头。如果服务器仅有部分名称空间支持WebDAV，则对非WebDAV资源（包括“/”）的OPTIONS请求都不应声明WebDAV支持。

它的值是资源支持的所有兼容级别的标识符（多个的话用逗号分隔）。兼容级别标识符可以是编码后的URL或token（由[RFC2616]定义）。标识符可以以任何顺序出现。token指的是经过了IETF RFC流程标准化的标识符，但是其他标识符应该使用Coded-URLs，以鼓励唯一性。

如果资源支持class-2或者class-3的兼容性，那么也必须明确显示class-1的兼容性。通常，对一种兼容级别的支持并不意味着对其他兼容级别的支持，特别是，对class-3的支持不强求对class-2的支持。有关本规范中定义的兼容性级别更多详细信息，请参阅第18节。

请注意，许多WebDAV服务器在收到“OPTIONS *”请求的时候不会声明对WebDAV的支持。

作为请求header时，此标头允许客户端（在服务器需要该信息时）提出自己对兼容级别的要求。除非标准跟踪规范要求，否则客户端不应主动发送此标头。任何使用它作为请求header的扩展都仔细考虑缓存意味着什么。

## 10.2 Depth Header

~~~text
Depth = "Depth" ":" ("0" | "1" | "infinity")
~~~

Depth header一般与在（可能具有内部成员的）资源上执行的方法一起使用，以指示该方法是仅应用于资源自身（“Depth:0”），仅应用于资源自身及其直接内部成员（“Depth:1”）或资源自身以及其所有后代成员（“Depth:infinity”）。

仅当method的定义明确提供了这种支持时，才支持Depth header。

以下规则是支持Depth header的所有methods的默认行为。一个method也可以通过定义不同的行为来覆盖这些默认设定。

支持Depth header的method可以选择不必支持header的所有值，并且可以在不存在Depth header的情况下根据情况定义method的行为。例如，MOVE方法仅支持“Depth:infinity”，并且如果不存在Depth header，它也将像拥有“Depth:infinity”header一样工作。

客户端不能指望服务器以原子操作方式或者以任何特定的顺序来（在其后代成员上）执行method指令，除非该特定method明确提供了此类保证。

具有Depth header的method开始执行后，将尽可能多地落实其被分配的任务，然后返回一个响应，明确指出其已经完成的任务和未能完成的任务。

因此，例如你尝试COPY有层次结构的资源时可能会出现某些成员被复制而某些成员没有被复制的结果。

默认情况下，Depth header不与其他header产生互动。也就是说，具有Depth header的请求上的每个标头必须仅应用于Request-URI（如果有对应资源的话），除非该标头有特殊定义的Depth header。

如果Depth header范围内的源或目标资源被锁定以阻止该方法的执行，那么必须通过使用一个If header将锁token与request一起提交。

Depth header仅指定有关内部成员的方法的行为。如果资源没有内部成员（也就是说不是集合类型的资源），则必须忽略Depth header。

## 10.3 Destination Header

Destination header用于指定一个URI，该URI为诸如COPY和MOVE之类的方法标识目标资源，这些方法将两个URI作为参数。
~~~text
Destination = "Destination" ":" Simple-ref
~~~

如果目标值是绝对URI（[RFC3986]的4.3节），则它可以指定目标为其他服务器（或其他端口或协议）。如果源服务器无法尝试复制到这个被指定的非本地服务器，则它必须使请求失败。请注意，在本规范中并未对将资源复制和移动到远程服务器的行为进行完整定义（例如特定的错误条件定义）。
如果“Destination”的值太长或不可接受，则服务器应返回400（错误请求），理想情况下，应在错误正文中提供有用的信息。

## 10.4 If Header

If header旨在提供与[RFC2616]的14.24节中定义的If-Match header相似的功能。但是，If header可处理任何状态token以及ETag。状态token的典型示例是锁token，并且锁token是本规范中定义的唯一状态令牌。

### 10.4.1 用途

If header有两个不同的用法：
- 第一个是通过提供一系列state list来实现对特定资源的条件化请求，这些state list通过匹配token和ETag条件来实现对特定资源的定位。如果评估了此header并且所有state list均失败，则请求必须失败，并显示412（失败的前提条件）状态。
- 另一个用途，仅当header所描述的state list之一成功时，请求才能成功。state list和匹配成功的标准在10.4.3和10.4.4节中定义。

此外，state token出现在If header中这一事实本身就意味着它已随请求被“提交”。通常这被用于表名客户端已经知晓了该状态令牌的相关信息。提交一个state token的语义取决于其类型（对于锁令牌，请参阅第6节）。

请注意，这两个目的需要加以区别对待：state token的被提交和发挥作用，跟服务器是否实际评估了其所现身其中的state list无关，也与其所表示的条件是否为真无关。

### 10.4.2 语法

~~~text
If = "If" ":" ( 1*No-tag-list | 1*Tagged-list ) 

No-tag-list = List
Tagged-list = Resource-Tag 1*List

List = "(" 1*Condition ")"
Condition = ["Not"] (State-token | "[" entity-tag "]")
; entity-tag: see Section 3.11 of [RFC2616]
; No LWS allowed between "[", entity-tag and "]"

State-token = Coded-URL

Resource-Tag = "<" Simple-ref ">" 
; Simple-ref: see Section 8.3
; No LWS allowed in Resource-Tag
~~~

语法分未标记列表（“No-tag-list”）和标记列表（“Tagged-list”）。未标记的列表适用于由Request-URI标识的资源，而标记列表适用于由Resource-Tag标识的资源。

Resource-Tag适用于所有后续列表，直至出现下一个Resource-Tag。

请注意，两种列表类型不能在一个If header中混用。 这不是功能的限制，而是因为“No-tag-list”语法只是“Tagged-list”产生的快捷方式，其中“Resource-Tag”引用了“ Request-URI”。

每个列表由一个或多个条件组成。每个条件都是根据entity-tag或state-token来定义的，可能会被前缀“Not”取反。

请注意，If header语法不允许在单个请求中使用If header的多个实例。 但是，HTTP header语法允许通过在换行符后插入空格来扩展多行展示的单个标头值（请参见[RFC2616]，第4.2节）。

### 10.4.3 List评估

如果资源与所描述的state相匹配（其中每个state的匹配功能在下面的第10.4.4节中定义），则由单个entity-tag或state-token组成的条件其评估结果为true。给它加上“Not”前缀会反转评估结果（因此“Not”仅适用于后续的entity-tag或state-token）。

每个List都描述了一系列条件。当且仅当每个条件的评估结果都为true时，整个列表的评估结果才为true（也就是说，如果有多于一个的条件，该list意味着对多个条件进行“and”逻辑运算）。

每个“No-tag-list”和“Tagged-list”都可以包含一个或多个lists。当且仅当包含的任何一个或多个list的评估结果为true时，它们的评估结果才为true（也就是说，如果存在多个List，则该Lists的结果就是对每个list结果进行“or”逻辑运算）。

最后，当且仅当No-tag-list或Tagged-list中的至少一个评估为true时，整个If header的评估结果才为true。如果header评估为false，则服务器必须以412（前提条件失败）状态拒绝请求。否则，可以像不存在header一样继续执行请求。

### 10.4.4 匹配state-token和ETag

在执行If haeder处理时，匹配state-token或entity-tag的定义如下：
- 标识一个资源：在Tagged-list中，资源由URI与令牌一起标识，在No-tag-list中，由Request-URI标识。
- 匹配一个entity-tag：实体标签与所标识资源相关联的实体标签相匹配。服务器必须使用[RFC2616]的13.3.3节中定义的弱或强比较功能来进行匹配。
- 匹配state-token：If header中的状态令牌与所标识资源上的任何状态令牌之间存在完全匹配。只要资源在锁范围内的任何位置，就可以认为锁状态令牌是匹配的。
- 处理未映射的URL：对于ETag和state-token，都应视为这个URL标识的资源存在但不具有指定state。

### 10.4.5 If header和Non-DAV-Aware代理

不能识别DAV的代理将不接受If header，因为它们将无法理解If头，并且HTTP要求忽略不可理解的头。与HTTP/1.1代理进行通信时，客户端必须使用“Cache-Control:no-cache”header，以防止代理在不知情的情况下尝试为其提供缓存服务。处理HTTP/1.0代理时，出于相同的原因，必须使用“Pragma:no-cache”request header。

因为通常客户端无法可靠地检测代理中间人是否支持DAV，所以建议他们始终使用上述方式来指令防止缓存。

### 10.4.6 实例 - No-tag

请求内容：
~~~text
If: (<urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2> 
  ["I am an ETag"])
  (["I am another ETag"])
~~~

这个If header要求从使用Request-URI中标识的资源中识别以下两种情况：
- 由指定的锁定令牌锁定，且拥有“I am an ETag”ETag，或者
- 只需要拥有“I am another ETag”ETag。

满足上述情况之一即可视作符合If header所提出的要求。

简而言之，可以把这个If header的要求表示成以下伪判断语句：
~~~text
( 
    is-locked-with(urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2) AND
    matches-etag("I am an ETag")
)
OR
(
    matches-etag("I am another ETag")
)
~~~

### 10.4.7 实例 - No-tag跟Not一起使用

请求内容：
~~~text
If: (Not <urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2> 
    <urn:uuid:58f202ac-22cf-11d1-b12d-002035b29092>)
~~~

该If header要求资源不得被urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2锁进行锁定，并且必须被urn:uuid:58f202ac-22cf-11d1-b12d-002035b29092锁进行锁定。

### 10.4.8 实例 - 一直为True的条件

在某些情况下，客户端希望提交状态令牌，但不希望仅因为状态令牌不再有效而导致请求失败。 一种简单的方法是包括一个始终为true的条件，例如：
~~~text
If: (<urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2>) 
    (Not <DAV:no-lock>)
~~~

众所周知，“DAV:no-lock”从不代表当前的锁定令牌。锁定令牌是由服务器根据第6.5节中所述的唯一性要求分配的，因此永远不可能能使用“DAV:”作为开头。 因此，通过对这个已知不是当前状态的state-token应用“Not”，条件就会始终评估为true了，这样整个If header也将始终为true，并且无论如何请求指令都将提交一个锁定令牌urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2。

### 10.4.9 实例 - 在COPY中使用Tagged-list If header

请求内容：
~~~text
COPY /resource1 HTTP/1.1 
Host: www.example.com 
Destination: /resource2 
If: </resource1> 
    (<urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2> 
    [W/"A weak ETag"]) (["strong ETag"])
~~~

在此示例中，http://www.example.com/resource1 被复制到 http://www.example.com/resource2 。当该方法首次应用于 http://www.example.com/resource1 时，resource1必须处于由((<urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2> [W/"A weak ETag"]) (["strong ETag"]))锁指定的状态下。 也就是说，它必须使用“urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2”的锁定令牌进行锁定，并且具有弱实体标签W/“A weak ETag”，或者必须具有强实体标签“strong ETag”。

### 10.4.10 实例 - 匹配带有集合锁的锁令牌

~~~text
DELETE /specs/rfc2518.txt HTTP/1.1 
Host: www.example.com 
If: <http://www.example.com/specs/> 
    (<urn:uuid:181d4fae-7d8c-11d0-a765-00a0c91e6bf2>)
~~~

对于此示例，锁令牌必须与指定资源（也就是If header中的url所标识的/specs/集合）的锁进行比较。如果这个集合没有被指定的锁所锁定，则请求必须失败。 否则，此请求可能会成功，因为If头的评估结果为true，并且已经提交了影响受影响资源的锁的锁令牌。

### 10.4.11 实例 - 匹配未映射 url 的 ETags

假定一个集合/specs不包含成员/specs/rfc2518.doc，这种情况下，下面这个If header
~~~text
If: </specs/rfc2518.doc> (["4217"])
~~~
将被评估为false（uri没有被映射，所以也就不具备匹配“4217”的ETag），但是下面这个If header
~~~text
If: </specs/rfc2518.doc> (Not ["4217"])
~~~
就能总是评估为true。

注意，使用这一模式时应当与10.4.4章节中对state-tokens的匹配有一样的考量。

## 10.5 Lock-Token Header

~~~text
Lock-Token = "Lock-Token" ":" Coded-URL
~~~

Lock-Token作为请求header时与UNLOCK方法一起使用，以标识要删除的锁。Lock-Token请求标头中的锁令牌必须标识一个锁，该锁包含由Request-URI标识的资源作为成员。

Lock-Token作为响应header时与LOCK方法一起使用，以指明因成功执行LOCK请求而创建的新锁令牌。

## 10.6 Overwrite Header

~~~text
Overwrite = "Overwrite" ":" ("T" | "F")
~~~

Overwrite header指定在COPY或MOVE期间服务器是否应覆盖映射到目标URL的资源。值“F”表示如果目标URL已经被映射到资源，则服务器不得执行COPY或MOVE操作。如果Overwrite header未包含在COPY或MOVE请求中，则资源必须将其值视为“T”。尽管“Overwrite”标头似乎重复了“If-Match:*” header的功能（请参阅[RFC2616]），但是If-Match仅适用于Request-URI，不适用于COPY或MOVE的目标。

如果由于Overwrite head的值而未执行COPY或MOVE操作，则该方法必须失败，并返回412（失败的前提条件）状态码。服务器必须先进行鉴权，然后再检查这个或其它任何条件header。

所有符合DAV标准的资源都必须支持Overwrite header。

## 10.7 请求中的Timeout Header

~~~text
TimeOut = "Timeout" ":" 1#TimeType 
TimeType = ("Second-" DAVTimeOutVal | "Infinite")  
           ; No LWS allowed within TimeType
DAVTimeOutVal = 1*DIGIT
~~~

客户端可以在其LOCK请求中包括Timeout header。但是不强求服务器去满足甚至考虑这些请求。客户端不得使用LOCK方法以外的任何其他method提交Timeout header。

“Second”这一TimeType指定的是希望在服务器上授予锁与自动删除锁之间所经过的秒数。TimeType“Second”的超时值不得大于232-1。

有关锁超时行为的说明，请参见第6.6节。