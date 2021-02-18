# 9. WebDAV的HTTP方法

## 9.1 PROPFIND Method

PROPFIND method负责检索资源的属性：
-  如果由Request-URI标识的资源没有任何内部成员，那么返回的就是这个资源上定义的属性
-  如果由Request-URI标识的资源是个有内部成员URLs的集合，那么返回的就是它自身及其可能存在的成员资源上定义的属性。所有DAV兼容的资源必须支持PROPFIND方法和PROPFIND XML元素(第14.20节)，以及其它相关的所有XML元素。

PROPFIND请求必须包含一个值为“0”、“1”或“infinity”的Depth header。服务器必须在WebDAV资源上支持“0”和“1”深度的请求，并且应该支持“infinity”深度的请求。在实践中，出于性能和安全问题的考量，可能会禁用对无限深度请求的支持。对于没有Depth header的请求，服务器应当视作“Depth: infinity”对待。

客户端可以在请求方法的body中提交一个“propfind”XML元素，描述所请求的信息。有可能：
-  通过在'prop'节点中点名需要的多个属性(顺序可能会被服务器忽略)来请求特定的属性值，
-  通过使用'allprop'元素('include'元素可以与'allprop'一起使用，以指示服务器也把其他可能无法返回的活属性包含进来)来请求本规范中定义的属性再加上死属性。
-  通过使用'propname'元素来请求一个包含了资源上定义的所有属性的名称列表

客户端也可能不会在PROPFIND请求中提交请求body，此时应当视作'allprop'请求对待
注意，'allprop'不会返回所有活属性的值。如今WebDAV服务器拥有了越来越多需要昂贵计算或内容冗长的属性(参见[RFC3253]和[RFC3744])因此已经不会再返回全部属性。相对应的，WebDAV客户端可以使用'propname'请求来发现存在哪些活属性，然后通过指定属性的名称来请求其值。对于在其他地方定义的或属性，该定义可以指定是否在'allprop'请求中返回该活属性。
所有服务器都必须支持返回类型为text/xml或application/xml的响应，该响应包含一个Multi-Status的xml元素，该元素描述尝试检索各种属性的结果。

如果检索属性时出现错误，则响应中必须包含对应的错误结果。检索不存在的属性值的请求是错误的，必须用包含404(Not Found)状态值的“response”XML元素来说明。

因此，集合资源的“Multi-Status”XML元素必须包含集合中每个成员URL的“response”XML元素，无论该请求的深度是多少，但是任何不兼容WebDAV的资源都不该被包含在内。每个'response'元素必须包含一个'href'元素，该元素指定了下列属性是属于那个资源URL的。集合资源上PROPFIND的结果以一个平面列表的形式返回，该列表的条目顺序不重要。请注意，对于给定名称的属性，资源可能只有一个值，因此该属性可能只在PROPFIND响应中显示一次。

属性可能受到访问控制。在'allprop'和'propname'请求的情况下，如果主体无权知道某个特定属性是否存在，那么该属性可能会被静默地排除在响应之外。

有些PROPFIND结果可能会被缓存，但要因为大多数属性没有缓存验证机制，所以要小心对打。该方法既安全又幂等(参见[RFC2616] 9.1节)。

### 9.1.1 PROPFIND状态码

与其他方法的类似部分一样，本节提供了一些错误代码和前置条件或后前置条件(在第16节中定义)的指导，这些对PROPFIND可能特别有用。

403 Forbidden -服务器可能会拒绝深度header为"Infinity"的集合的PROPFIND请求，在这种情况下，它应该在错误体中使用前置条件代码'propfind-finite-depth'。

### 9.1.2 在'propstat'元素中使用的状态代码

在PROPFIND响应中，单个属性的信息会被包裹在“propstat”元素中返回(见14.22节)，每个元素都包含一个单独的“status”元素，其中包含着关于此属性的信息。下面的列表总结了“propstat”中最常用的状态代码，但是客户端还是应该准备好处理其他2/3/4/5xx系列状态码。
-  200 OK - 属性存在并且/或者成功返回它的值。
-  401 Unauthorized - 未授权的-没有权限查看该属性。
-  403 Forbidden - 不管授权如何，此属性禁止查看
-  404 Not Found - 属性不存在

### 9.1.3 实例 - 获取指定命名的属性

请求内容：
~~~xml
PROPFIND /file HTTP/1.1 
Host: www.example.com 
Content-type: application/xml; charset="utf-8" 
Content-Length: xxxx 
<?xml version="1.0" encoding="utf-8" ?> 
<D:propfind xmlns:D="DAV:"> 
    <D:prop xmlns:R="http://ns.example.com/boxschema/"> 
        <R:bigbox/> 
        <R:author/> 
        <R:DingALing/> 
        <R:Random/> 
    </D:prop> 
</D:propfind>
~~~

返回内容：
~~~xml
HTTP/1.1 207 Multi-Status 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 
<?xml version="1.0" encoding="utf-8" ?> 
<D:multistatus xmlns:D="DAV:"> 
    <D:response xmlns:R="http://ns.example.com/boxschema/"> 
        <D:href>http://www.example.com/file</D:href> 
        <D:propstat> 
            <D:prop> 
                <R:bigbox> 
                    <R:BoxType>Box type A</R:BoxType> 
                </R:bigbox> 
                <R:author> 
                    <R:Name>J.J. Johnson</R:Name> 
                </R:author> 
            </D:prop> 
            <D:status>HTTP/1.1 200 OK</D:status> 
        </D:propstat> 
        <D:propstat> 
            <D:prop>
                <R:DingALing/>
                <R:Random/>
            </D:prop> 
            <D:status>HTTP/1.1 403 Forbidden</D:status> 
            <D:responsedescription>
                The user does not have access to the DingALing property. 
            </D:responsedescription> 
        </D:propstat> 
    </D:response> 
    <D:responsedescription>
        There has been an access violation error.
    </D:responsedescription> 
</D:multistatus>
~~~

在此示例中，对非集合资源 http://www.example.com/file 执行PROPFIND。 propfind XML元素指定了四个需要其值的属性的名称。在这种情况下，仅返回了两个属性，因为发出请求的主体没有足够的访问权限来查看第三个和第四个属性。

### 9.1.4 实例 - 使用propname获取全部属性名称

请求内容：
~~~xml
PROPFIND /container/ HTTP/1.1 
Host: www.example.com 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 
    
<?xml version="1.0" encoding="utf-8" ?> 
<propfind xmlns="DAV:"> 
    <propname/>
</propfind>
~~~ 

返回内容：
~~~xml
HTTP/1.1 207 Multi-Status 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 
    
<?xml version="1.0" encoding="utf-8" ?> 
<multistatus xmlns="DAV:"> 
    <response> 
        <href>http://www.example.com/container/</href> 
        <propstat> 
            <prop xmlns:R="http://ns.example.com/boxschema/"> 
                <R:bigbox/> 
                <R:author/> 
                <creationdate/> 
                <displayname/> 
                <resourcetype/> 
                <supportedlock/> 
            </prop> 
            <status>HTTP/1.1 200 OK</status> 
        </propstat> 
    </response> 
    <response> 
        <href>http://www.example.com/container/front.html</href> 
        <propstat> 
            <prop xmlns:R="http://ns.example.com/boxschema/"> 
                <R:bigbox/> 
                <creationdate/> 
                <displayname/> 
                <getcontentlength/> 
                <getcontenttype/> 
                <getetag/> 
                <getlastmodified/> 
                <resourcetype/> 
                <supportedlock/> 
            </prop> 
        <status>HTTP/1.1 200 OK</status> 
        </propstat> 
    </response> 
</multistatus> 
~~~

在此示例中，使用包含propname元素的propfind XML在集合资源 http://www.example.com/container/ 上调用PROPFIND，这意味着应返回所有属性的名称。由于不存在任何Depth标头，因此假定其默认值为“infinity”，这意味着应返回集合及其所有后代的属性名称。

与前面的示例一致，资源 http://www.example.com/container/ 上定义了六个属性：“ http://ns.example.com/boxschema/” 命名空间中的bigbox，author，以及不在命名空间中的creationdate，displayname，resourcetype和“DAV:”命名空间中的supportedlock。

资源 “http://www.example.com/container/index.html” 是“container”集合的成员，上面定义了九个属性：在 “http://ns.example.com/boxschema/” 名称空间中的bigbox和“DAV:”命名空间中的creationdata，displayname，getcontentlength，getcontenttype，getetag，getlastmodified，resourcetype和supportedlock。

此示例还演示了XML名称空间作用域和默认命名空间的用法。由于“xmlns”属性不包含前缀，因此这个命名空间默认情况下适用于所有包含的元素。因此，所有未明确声明其所属名称空间的元素都是“DAV:”名称空间的成员。

### 9.1.5 实例 - 使用 allprop

注意，尽管“allprop”的名称保留了向后兼容性，但它不会返回每个属性，而是仅返回死属性以及该规范中定义的活属性。
请求内容：
~~~xml
PROPFIND /container/ HTTP/1.1
Host: www.example.com
Depth: 1
Content-Type: application/xml; charset="utf-8"
Content-Length: xxxx
<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:">
    <D:allprop/>
</D:propfind>
~~~

返回内容：
~~~xml
HTTP/1.1 207 Multi-Status
Content-Type: application/xml; charset="utf-8"
Content-Length: xxxx
<?xml version="1.0" encoding="utf-8" ?>
<D:multistatus xmlns:D="DAV:">
    <D:response>
        <D:href>/container/</D:href>
        <D:propstat>
            <D:prop xmlns:R="http://ns.example.com/boxschema/">
                <R:bigbox><R:BoxType>Box type A</R:BoxType></R:bigbox>
                <R:author><R:Name>Hadrian</R:Name></R:author>
                <D:creationdate>1997-12-01T17:42:21-08:00</:creationdate>
                <D:displayname>Example collection</D:displayname>
                <D:resourcetype><D:collection/></D:resourcetype>
                <D:supportedlock>
                <D:lockentry>
                    <D:lockscope><D:exclusive/></D:lockscope>
                    <D:locktype><D:write/></D:locktype>
                </D:lockentry>
                <D:lockentry>
                    <D:lockscope><D:shared/></D:lockscope>
                    <D:locktype><D:write/></D:locktype>
                </D:lockentry>
                </D:supportedlock>
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>
    <D:response>
        <D:href>/container/front.html</D:href>
        <D:propstat>
            <D:prop xmlns:R="http://ns.example.com/boxschema/">
                <R:bigbox><R:BoxType>Box type B</R:BoxType></R:bigbox>
                <D:creationdate>1997-12-01T18:27:21-08:00<D:creationdate>
                <D:displayname>Example HTML resource</D:displayname>
                <D:getcontentlength>4525</D:getcontentlength>
                <D:getcontenttype>text/html</D:getcontenttype>
                <D:getetag>"zzyzx"</D:getetag>
                <D:getlastmodified>Mon, 12 Jan 1998 09:25:56 GMT<D:getlastmodified>
                <D:resourcetype/>
                <D:supportedlock>
                <D:lockentry>
                    <D:lockscope><D:exclusive/></D:lockscope>
                    <D:locktype><D:write/></D:locktype>
                </D:lockentry>
                <D:lockentry>
                    <D:lockscope><D:shared/></D:lockscope>
                    <D:locktype><D:write/></D:locktype>
                </D:lockentry>
                </D:supportedlock>
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>
</D:multistatus>
~~~

此示例在资源 http://www.example.com/container/ 上调用了PROPFIND，其Depth header为1，这意味着该请求适用于此资源及其子级，并且携带了一个propfind XML元素其中包含allprop元素，这表示请求应返回资源上定义的所有死属性的名称和值，以及此规范中定义的所有属性的名称和值。此示例说明了如何在响应的“href”元素中使用相对引用。

资源 http://www.example.com/container/上定义了六个属性：“http://ns.example.com/boxschema/” 命名空间中的author，bigbox，以及DAV:creationdate，DAV:displayname，DAV:resourcetype和DAV:supportedlock。

最后四个属性是WebDAV特有的，在第15章中有具体定义。由于此资源不支持GET，因此未在该资源上定义get*属性（例如DAV:getcontentlength）。WebDAV属性告诉我们，“container”容器创建于格林尼治标准时间西8区1997年12月1日下午5:42:21（来自属性DAV:creationdate），它的显示名称为“Example collection”（来自属性DAV:displayname），它是集合资源类型（来自属性DAV:resourcetype），并支持排他写入锁和共享写入锁（来自DAV:supportedlock）。

资源 http://www.example.com/container/front.html 上定义了九个属性：
“http://ns.example.com/boxschema/” 命名空间中的“bigbox”（“bigbox”属性类型的另一个实例），DAV:creationdate，DAV:displayname，DAV:getcontentlength，DAV:getcontenttype，DAV:getetag，DAV:getlastmodified，DAV:resourcetype和DAV:supportedlock。

DAV属性告诉我们，“front.html”创建于格林尼治标准时间西8区1997年12月1日下午6:27:21（来自DAV:creationdate），其名称为“Example HTML resource”（来自DAV:displayname），内容长度为4525字节（来自DAV:getcontentlength），MIME类型为“text/html”（来自DAV:getcontenttype），实体标签为“zzyzx”（来自DAV：getetag），最后更改时间是格林威治标准时间1998年1月12日星期一09:25:56（来自DAV:getlastmodified），资源类型为空，这意味着它不是集合（DAV:resourcetype），并且同时支持独占写入锁和共享写入锁（来自DAV:supportedlock）。

### 9.1.6 实例 - 使用 allprop 和 include

请求内容：
~~~xml
PROPFIND /mycol/ HTTP/1.1 
Host: www.example.com 
Depth: 1 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 
    
<?xml version="1.0" encoding="utf-8" ?> 
<D:propfind xmlns:D="DAV:"> 
    <D:allprop/>
    <D:include> 
        <D:supported-live-property-set/> 
        <D:supported-report-set/> 
    </D:include> 
</D:propfind> 
~~~

在此示例中，PROPFIND在资源 http://www.example.com/mycol/ 及其内部成员资源上执行。 客户端请求此规范中定义的所有属性、所有死属性以及[RFC3253]中定义的另外两个活属性的值。 未显示该响应。

## 9.2 PROPPATCH方法

PROPPATCH方法处理在请求body中指定的指令，以设置和/或删除在Request-URI所标识的资源上定义的属性。

所有支持DAV标准的资源都必须支持PROPPATCH方法，并且处理使用XML元素中propertyupdate，set和remove元素来描述的指令。当然指令的执行要受访问控制的约束。支持DAV的资源应支持任意死属性的设置。

PROPPATCH方法的请求消息body中必须包含propertyupdate XML元素。

服务器必须按文档顺序处理PROPPATCH指令（与顺序无关的普通规则除外）。指令必须要么全部执行要么全都不执行。因此，如果在处理期间发生任何错误，则必须回滚所有已执行的指令，并返回错误描述。指令处理的详细信息可以在第14.23节和第14.26节的集合定义和删除指令中找到。

如果服务器尝试在PROPPATCH请求中进行任何属性更改（在处理指令之前，该请求没有因其它高阶错误而被拒绝），则响应必须是第9.2.1节中描述的多状态响应。

此方法是幂等的，但并不安全（请参阅[RFC2616]的9.1节），所以不能缓存对此方法的响应。

### 9.2.1 在“propstat”元素中使用的状态码

在PROPPATCH响应中，有关各个属性的信息会在“propstat”元素内返回（请参见第14.22节），每个元素都有一个单独的“status”元素，其中包含有对应属性的相关信息。以下列表总结了在“propstat”中使用的最常见状态代码；但是，客户端也应准备好处理其他2/3/4/5xx系列的状态码。
- 200（OK）- 属性设置或更改成功。请注意，由于PROPPATCH的原子操作特性，如果此状态出现在某一个属性中，它也会出现在响应中的每个属性中。
- 403（禁止访问）- 由于服务器不方便告知的原因，客户端无法更改属性之一。
- 403（禁止访问）- 客户端尝试设置一个受保护的属性，例如DAV:getetag。如果返回此错误，则服务器应在响应正文中使用precondition代码“cannot-modify-protected-property”。
- 409（冲突）- 客户端提供了一个值，该值的语义不适用于该属性。
- 424（失败的依赖关系）-由于另一个失败的属性更改而无法进行属性更改。
- 507（存储空间不足）-服务器没有足够的空间来记录该属性。

### 9.2.2 实例 - PROPPATCH

请求内容：
~~~xml
PROPPATCH /bar.html HTTP/1.1 
Host: www.example.com 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 
<?xml version="1.0" encoding="utf-8" ?> 
<D:propertyupdate xmlns:D="DAV:" xmlns:Z="http://ns.example.com/standards/z39.50/">
    <D:set> 
        <D:prop> 
            <Z:Authors> 
                <Z:Author>Jim Whitehead</Z:Author> 
                <Z:Author>Roy Fielding</Z:Author> 
            </Z:Authors> 
        </D:prop> 
    </D:set> 
    <D:remove> 
        <D:prop><Z:Copyright-Owner/></D:prop> 
    </D:remove> 
</D:propertyupdate> 
~~~

返回内容：
~~~xml
HTTP/1.1 207 Multi-Status 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 

<?xml version="1.0" encoding="utf-8" ?> 
<D:multistatus xmlns:D="DAV:" xmlns:Z="http://ns.example.com/standards/z39.50/"> 
    <D:response> 
        <D:href>http://www.example.com/bar.html</D:href> 
        <D:propstat> 
            <D:prop><Z:Authors/></D:prop> 
            <D:status>HTTP/1.1 424 Failed Dependency</D:status> 
            </D:propstat> 
            <D:propstat> 
            <D:prop><Z:Copyright-Owner/></D:prop> 
            <D:status>HTTP/1.1 409 Conflict</D:status> 
        </D:propstat> 
        <D:responsedescription> Copyright Owner cannot be deleted or altered.</D:responsedescription> 
    </D:response> 
</D:multistatus> 
~~~

在此示例中，客户端请求服务器在“http://ns.example.com/standards/z39.50/” 命名空间中设置“Authors”属性的值，并删除属性“Copyright-Owner”。在同一名称空间中。由于无法删除版权所有者属性，因此不会进行任何属性修改。Authors属性的424（依赖关系失败）状态码表示，如果与删除Copyright-Owner属性无关，则此操作将成功。

## 9.3 MKCOL方法

MKCOL在Request-URI指定的位置创建一个新的集合(Collection)资源。如果Request-URI已经被映射到现有资源，则MKCOL必须失败。在MKCOL处理期间，服务器必须使Request-URI成为其父集合的内部成员，除非Request-URI为“/”。如果不存在这样的父路径，则该方法必须失败。当MKCOL操作创建一个新的集合资源时，所有祖先容器必须都已经存在，否则该方法必须失败并显示409（冲突）状态代码。例如，如果发出创建集合/a/b/c/d/的请求，并且/a/b/c/不存在，则该请求必须失败。

在没有请求正文的情况下调用MKCOL时，新创建的集合不应该有成员。

MKCOL请求消息可能包含一个消息body。当存在消息body时，MKCOL请求的确切行为是不确定的，但仅限于创建集合，集合的成员，成员的内容以及集合或成员的属性。如果服务器收到不支持或无法理解的MKCOL请求实体类型，则它必须以415（不支持的媒体类型）状态码进行响应。如果服务器根据实体的表征或类型决定拒绝请求，则也应使用415（不支持的媒体类型）状态码返回。

此方法是幂等的，但并不安全（请参阅[RFC2616]的9.1节）。所以不能缓存对此方法的响应。

### 9.3.1 MKCOL状态码

除可能的常规状态代码外，以下状态代码对MKCOL具有特定的适用性：
- 201（已创建）- 已创建集合。
- 403（Forbidden）- 至少表示以下两种情况之一：
    - 1）服务器不允许在其URL名称空间的给定位置创建集合，
    - 2）Request-URI的父集合存在但不能接受成员。
- 405（不允许使用方法）- MKCOL只能在未映射的URL上执行。
- 409（冲突）- 在创建一个或多个中间层级的集合之前，无法在Request-URI上进行创建集合。服务器不得自动创建这些中间层级的集合。
- 415（不受支持的媒体类型）- 服务器不支持请求body的类型（尽管body在MKCOL请求中是合法的，因为此规范未定义任何主体，因此服务器可能不支持任何给定的body类型）。
- 507（存储空间不足）- 执行此方法后，资源没有足够的空间来记录资源的状态。

### 9.3.2 - 实例 - MKCOL

请求内容：
~~~text
MKCOL /webdisc/xfiles/ HTTP/1.1 
Host: www.example.com 
~~~

返回内容：
~~~text
HTTP/1.1 201 Created 
~~~

## 9.4 集合的 GET/HEAD 方法

GET的语义在应用于集合时不会更改，因为GET被定义为“检索Request-URI标识的任何信息（以实体的形式）”[RFC2616]。当将GET应用于集合时，它可以返回“index.html”资源的内容、该集合内容的人类可读视图或其他所有内容。因此，集合上GET的结果可能与集合的成员关系不相关。
同样，由于HEAD的定义是不带响应消息主体的GET，因此将HEAD的语义应用于集合资源时也不会被改变。

## 9.5 集合的POST方法

由于按照约定，POST执行的实际功能是由服务器确定的，并且通常这个功能取决于特定的资源，因此在应用于集合时，POST的行为无法进行有意义的修改，因为它很大程度上是未经规范的。所以POST的语义在应用于集合时不会被修改。

## 9.6 DELETE操作要求

DELETE在[RFC2616]的9.7节中被定义为“删除由Request-URI所标识的资源”。但是，WebDAV更改了一些DELETE处理的要求。

服务器成功的完成DELETE请求：
- 必须销毁所有锁根(lock-root)是已删除资源的锁
- 必须删除从Request-URI到任何资源的映射。

因此，在成功的DELETE操作之后（并且在没有其他操作的情况下），对目标Request-URI的后续GET/HEAD/PROPFIND等请求都必须返回404（未找到）。

### 9.6.1 删除集合

集合上的DELETE方法必须像在其上使用“Depth:infinity” header一样工作。在对集合进行DELETE操作时，客户不得提交任何值为“infinity”之外的Depth头。

DELETE指示要删除Request-URI中指定的集合及其内部成员URL标识的所有资源。

如果无法删除某个由成员URL标识的资源，那么也不得删除它的所有祖先，以保持URL名称空间的有效性和一致性。

在删除集合资源中的每个资源时，都必须应用DELETE中附带的所有header。

DELETE方法完成处理后，必须保持一致的URL名称空间。

如果删除成员资源（非请求URI中标识的资源本身）时发生错误，则响应可以是207（多状态）。此处使用多状态来指示没能删除哪些内部资源，包括其错误代码，这有助于客户端了解到底哪些资源导致了失败。例如，如果内部某个资源被锁定，则Multi-Status的body可以包含状态为423（锁定）的response元素。

如果请求完全失败，则服务器可能会返回4xx状态响应，而不是207。

424（失败的依存关系）状态代码不应出现在DELETE的207（多状态）响应中。可以安全地将它们排除在外，因为当客户端收到有关后代的错误时，客户端将知道无法删除资源的祖先。此外，在207（多状态）中不应返回204（无内容）错误。禁止的原因是默认的成功代码就是204（无内容）。

### 9.6.2 实例 - DELETE

请求内容：
~~~text
  DELETE  /container/ HTTP/1.1 
  Host: www.example.com 
~~~

返回内容：
~~~xml
HTTP/1.1 207 Multi-Status 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 
    
<?xml version="1.0" encoding="utf-8" ?> 
<d:multistatus xmlns:d="DAV:"> 
    <d:response> 
        <d:href>http://www.example.com/container/resource3</d:href> 
        <d:status>HTTP/1.1 423 Locked</d:status> 
        <d:error><d:lock-token-submitted/></d:error>
    </d:response> 
</d:multistatus> 
~~~

在此示例中，删除 http://www.example.com/container/resource3 的尝试失败，因为它已被锁定，并且请求没有提交有效的锁令牌。因此删除 http://www.example.com/container/ 也失败。所以客户端知道自己尝试删除 http://www.example.com/container/ 一定是失败了，因为除非删除了所有子元素，否则父容器无法被删除。虽然未包含Depth标头，由于该方法作用在了集合上，因此必须假定Depth为无穷深。

## 9.7 PUT操作要求

### 9.7.1 非收集资源的PUT

在现有资源上执行的PUT将替换资源GET得到的响应实体。在PUT处理期间，资源上定义的属性可以重新计算，但是资源本身内容不受影响。例如，如果服务器识别出请求body的内容类型，则它可能能够自动从属性中提取有帮助的信息。

PUT请求会导致一个资源的创建，如果没有恰当的父集合空间，PUT必须失败，并显示409（冲突）。

PUT请求允许客户端指示实体body具有哪种媒体类型，以及是否应重写该媒体类型。因此，客户端应为新资源提供Content-Type（如果已知）header。如果客户端没有为新资源提供Content-Type，则服务器可能会创建未分配Content-Type的资源，或者也可能会尝试分配一个Content-Type。

请注意，尽管服务端接收者通常应将HTTP请求提供的元数据视为靠谱的，但实际上并不能保证服务器将接受客户端提供的元数据（例如，任何以“Content-”开头的请求标头）。首先，许多服务器不允许在每个资源的基础上配置Content-Type。因此，客户端不能总是拥有依靠包含Content-Type的请求header来直接影响内容类型的能力。

### 9.7.2 集合的PUT

本规范未定义对现有集合进行PUT请求的行为。对现有集合的PUT请求可能被视为错误（不允许使用405方法）。

MKCOL方法才是被定义用来创建集合的。

## 9.8 COPY方法

COPY方法目的是把由Request-URI标识的源资源，拷贝一个副本到Destination header中的URI所标识的位置。Destination header是必须的。 COPY方法的确切行为取决于源资源的类型。

所有符合WebDAV标准的资源都必须支持COPY方法。但是，对COPY方法的支持并不能保证复制资源成功。例如，不同的程序都可以控制同一服务器上的资源，但是可能无法将资源复制到似乎在同一服务器上的位置。

此方法是幂等的，但并不安全（请参阅[RFC2616]的9.1节）。所以不得缓存对此方法的响应。

### 9.8.1 COPY非收集资源

当源资源不是集合时，COPY方法的结果是在目标处创建新资源，该资源的状态和行为应尽可能与源资源的状态和行为匹配。由于服务器控制范围之外的因素（例如，缺少正确操作所需的其它资源），导致目的地的环境可能与来源的环境不同，因此可能无法完全复制资源的行为到目的地。随后对目标资源的更改不会修改源资源。对源资源的后续更改不会修改目标资源。

### 9.8.2 COPY属性

成功调用COPY后，应在目标资源上复制源资源上的所有死属性。本文档中描述的活属性也应当被复制到目标资源，但不必具有相同的值。服务器不应将活属性转换为目标资源上的死属性，否则客户端随后可能会得出关于资源状态或功能的错误结果。请注意有一些活属性被定义成缺少了它会具有特定含义（比如，如果它存在则标志具有一种含义；如果不存在，则具有相反的含义），在这种情况下，COPY动作完成后（由于这个活属性不存在所以没有被拷贝）可能会导致该属性被在后续请求中报告为“未找到”。

当目标是未映射的URL时，COPY操作会像PUT操作一样创建新资源。与资源创建相关的活属性（例如DAV:creationdate）应相应设置其值。

### 9.8.3 COPY集合

如果一个作用在集合上的COPY方法没有设置Depth header，服务器必须像对待有“infinity”值的Depth header一样进行处理。客户端对集合执行COPY操作时可以把“0”或“infinity”作为Depth header的值进行提交。服务器必须在符合WebDAV标准的资源上支持“0”和“infinity”作为Depth header的值。

无限深度COPY指示将Request-URI标识的集合资源复制到Destination标头中URI标识的位置，并将其所有内部成员按照其相对位置递归复制到目标位置的对应位置。请注意，如果考虑不周出现错误指令，那么/A/到/A/B/的无限深度COPY可能导致无限递归。

“Depth:0”的COPY意味着要复制集合自身及其属性，而不要复制其内部成员URL所标识的资源。
COPY附带的任何header都必须应用于处理待复制资源的每个操作，但是Destination header除外。

Destination Header仅指定Request-URI的目标URI。当应用于由Request-URI标识的集合的成员时，将调整Destination的值以反映层次结构中的当前位置。因此，如果请求URI为/a/，且主机标头值为http://example.com/ ，而Destination是http://example.com/b/ ，那么当http://example.com/a/c/d 被处理时，它必须使用http://example.com/b/c/d 作为Destination。

COPY方法完成处理后，必须已在目标位置创建了一致的URL命名空间（有关命名空间一致性的定义，请参见第5.1节）。但是，如果在复制某个内部成员集合时发生错误，则服务器不得复制此集合成员所标识的任何资源（即服务器必须跳过此子树），因为这会导致名称空间不一致。在检测到错误之后，COPY操作应尝试完成尽可能多的原始复制操作（即服务器仍应尝试复制那些没有错误的集合的所有后代）。

因此，如果对包含/a/b/和/a/c/的集合/a/执行无限深度COPY操作，并且在复制/a/b/时发生错误，则仍应尝试复制/a/c/。同样，在将非集合资源作为无限深度COPY的一部分进行复制时遇到错误，服务器应尝试完成尽可能多的其它拷贝操作。

如果错误发生在被请求URI标识的资源以外（即它的后代资源身上），则响应必须为207（多状态），并且应该为导致失败的资源的URL指明其错误。

COPY方法在207（多状态）响应中不应返回424（依赖关系失败）的状态代码。可以安全地省略这些响应，因为客户端会在收到父级错误时就已知道那些无法复制资源的后代。此外，COPY方法的207（多状态）响应中的值不应包含201（已创建）/204（无响应内容）状态码。由于它们是默认的成功代码，因此也可以安全地省略它们。

### 9.8.4 COPY和覆盖目标资源

如果COPY请求的Overwriting header值为“F”，并且目标URL上已经存在资源，则服务器必须使请求失败。

当服务器执行COPY请求并覆盖目标资源时，确切的行为可能取决于许多因素，包括WebDAV扩展功能（特别是[RFC3253]）。例如，当普通资源被覆盖时，服务器可以在进行复制之前删除目标资源，或者可以就地覆盖以保留活动属性。

覆盖集合时，成功COPY请求之后目标集合的成员关系必须立即与COPY之前的源集合的成员关系相同。因此，将源集合和目标集合的成员关系合并到目标中并不是一种合规行为。换言之，对集合的可覆盖COPY实质上是一种对原有集合的替代关系，而非合并关系。

如果客户端要求在COPY之前清除目标URL的状态（例如，强制重置活属性），那么客户端可以在COPY请求之前将DELETE发送到目标，以确保此重置。

### 9.8.5 状态码

除了可能的常规状态代码外，以下状态代码还特别适用于COPY：
- 201（已创建）- 已成功复制源资源。 COPY操作导致创建了新资源。
- 204（无响应内容）- 源资源已成功复制到先前存在的目标资源。
- 207（多状态）- COPY将影响多个资源，但是其中一些错误导致操作无法进行。特定错误消息以及其对应的源URL和目标URL应当一起出现在多状态响应中。例如，如果目标资源被锁定且无法覆盖，则目标资源URL的状态为423（已被锁定）。
- 403（禁止）- 禁止操作。 COPY的一种特殊情况是源资源和目标资源是同一资源。
- 409（冲突）- 在创建一个或多个中间集合之前，无法在目标位置创建资源。服务器不得自动创建这些中间集合。
- 412（前提条件失败）- 前提header检查失败，例如，Overwrite header为“F”，并且目标URL已映射到资源。
- 423（已被锁定）- 目标资源或目标集合中的资源被锁定。该响应应当包含“lock-token-submitted”的precondition元素。
- 502（错误的网关）- 当目标位于另一个服务器，存储库或URL名称空间上时，可能会发生这种情况。要么源名称空间不支持复制到目标名称空间，要么目标名称空间拒绝接受资源。客户可能希望尝试GET/PUT和PROPFIND/PROPPATCH方法。
- 507（存储空间不足）- 执行此方法后，目标资源没有足够的空间来记录资源的状态。

### 9.8.6 实例 - 允许覆盖的COPY

此示例显示资源 http://www.example.com/~fielding/index.html 复制到位置 http://www.example.com/users/f/fielding/index.html 。状态代码为204（无响应内容）指示目标处的现有资源已被覆盖。

请求内容：
~~~text
COPY /~fielding/index.html HTTP/1.1 
Host: www.example.com 
Destination: http://www.example.com/users/f/fielding/index.html 
~~~

返回内容：
~~~text
HTTP/1.1 204 No Content 
~~~

### 9.8.7 实例 - 不允许覆盖的COPY

这个例子演示了跟上面一样的拷贝操作，但是带有一个值为“F”的Overwrite header，于是就返回了一个412（前提条件失败）的代码，原因是目标url已经被映射到某个资源了。

请求内容：
~~~text
COPY /~fielding/index.html HTTP/1.1 
Host: www.example.com 
Destination: http://www.example.com/users/f/fielding/index.html 
Overwrite: F 
~~~
返回内容：
~~~
HTTP/1.1 412 Precondition Failed 
~~~

### 9.8.8 对集合的COPY

请求内容：
~~~text
COPY /container/ HTTP/1.1 
Host: www.example.com 
Destination: http://www.example.com/othercontainer/ 
Depth: infinity 
~~~

返回内容：
~~~xml
HTTP/1.1 207 Multi-Status 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 

<?xml version="1.0" encoding="utf-8" ?> 
<d:multistatus xmlns:d="DAV:"> 
    <d:response> 
        <d:href>http://www.example.com/othercontainer/R2/</d:href> 
        <d:status>HTTP/1.1 423 Locked</d:status> 
        <d:error><d:lock-token-submitted/></d:error>
    </d:response> 
</d:multistatus> 
~~~

Depth header不是必需的，因为在集合上COPY的默认行为跟提交了“Depth:infinity”header是一样的。 在此示例中，大多数资源以及集合都已成功复制。 但是，集合R2复制失败，因为目标R2已锁定。 由于复制R2时出错，因此也没有复制R2的成员。 但是，出于错误最小化规则，并未（也无需）列出这些成员的错误。

## 9.9 MOVE方法

在非集合资源上执行MOVE操作在逻辑上等效于先拷贝（COPY），然后进行一致性处理，最后删除源，在此操作中所有三个操作被合并到一个操作中执行。一致性维护步骤允许服务器执行由移动引起的更新，例如更新所有URL，而不只是标识源资源的Request-URI，以指向新的目标资源。

Destination header必须出现在所有MOVE方法上，并且必须遵循MOVE方法中COPY部分的所有COPY要求。所有符合WebDAV规范的资源都必须支持MOVE方法。

对MOVE方法的支持并不能保证将资源移动到特定目标。例如，不同程序可以控制同一服务器上的不同资源集。因此可能无法在似乎属于同一服务器的名称空间内移动资源。

如果目标处已经存在资源，则该目标资源将因为MOVE操作的后继效应被删除，但要遵守Overwrite header的限制。

此方法是幂等的，但并不安全（请参阅[RFC2616]的9.1节）。因此不得缓存对此方法的响应。

### 9.9.1 移动属性

本文档中描述的活属性应与资源一起移动，以使资源在目标资源处具有相同的活属性，但不一定具有相同的值。请注意，有一些活属性它们本身的存在与否具有特定含义（例如，如果存在，则标志具有一种含义，如果不存在，则具有相反的含义），在这些情况下，成功的MOVE可能导致该属性被在后续请求中报告为“未找到”（因为这个活属性不存在，所以当然不会一同被移动）。如果活属性在目标位置上无法以（与源位置）相同的方式工作，则服务器可能会失败请求。

客户端经常使用MOVE来实现不改变父集合的情况下重命名文件，因此它不适合用在重置资源（创建时设置的所有）活属性这样的场景。例如，DAV:creationdate属性值在MOVE之后应保持不变。

死属性必须与资源一起移动。

### 9.9.2 移动集合

带有“Depth:infinity” header的MOVE指示将Request-URI标识的集合移动到Destination header中指定的地址，并且将其内部成员URL标识的所有资源都通过递归地移动到目标位置并按照相对应的层级结构进行组织。

集合上的MOVE方法必须像在其上使用“Depth:infinity”header一样工作。客户端不得在集合的MOVE上使用“infinity”以外的任何值来提交Depth header。

除Destination header外，必须将MOVE包含的任何header应用于处理其每个相关资源的过程。 Destination header的行为与对集合的COPY给出的行为相同。

当MOVE方法完成处理后，它必须在源和目标处都创建了一致的URL命名空间（有关命名空间一致性的定义，请参见第5.1节）。但是，如果在移动其内部集合时发生错误，则服务器不得移动失败集合下所有成员标识的任何资源（即，服务器必须跳过引起错误的子树），因为这会导致名称空间不一致。在这种情况下检测到错误之后，移动操作应继续尝试完成尽可能多的移动（即服务器仍应尝试移动不是错误资源后代的其他子树及其成员标识的资源到目标集合）。因此，如果对包含/a/b/和/a/c/的集合/a /执行无限深度移动，而移动/a/b/时发生错误，则仍应尝试尝试移动/a/c/。同样，在无限深度移动中移动非集合资源遇到错误之后，服务器也应尝试继续完成尽可能多的其它移动操作。

如果除Request-URI中标识的资源以外的其他资源（也就是集合的后代成员）发生错误，则响应必须为207（多状态），并且为出现错误的资源的URL指明错误。

不应从MOVE方法的207（多状态）响应中返回424（依赖关系失败）状态代码。可以安全地忽略这些错误，因为当客户端收到父级错误时，客户端将知道无法移动资源的后代。此外，MOVE不应该将201（已创建）/ 204（无响应内容）响应作为207（多状态）响应中的值返回。可以安全地忽略这些响应，因为它们是默认的成功代码。

### 9.9.3 MOVE和Overwrite header

如果目标处存在资源且Overwrite header为“T”，则在执行移动之前，服务器必须在目标资源上执行带有“Depth:infinity”的DELETE。 如果“覆盖”标头设置为“F”，则该操作将失败。

### 9.9.4 状态码

除了可能的常规状态代码外，以下状态代码还具有特定的MOVE适用性：
- 201（已创建）-源资源已成功移动，并且在目标位置创建了新的URL映射。
- 204（无响应内容）-源资源已成功移动到已映射的URL。
- 207（多状态）-MOVE将影响多个资源，但是其中一些错误导致操作无法进行。特定错误消息以及其对应的源URL和目标URL会出现在多状态响应的正文中。例如，如果源资源被锁定并且无法移动，则源资源URL的状态为423（“锁定”）。
- 403（禁止）-在禁止MOVE操作的可能原因中，当源资源和目标资源相同时，建议使用此状态代码。
- 409（冲突）-在创建一个或多个中间路径的集合之前，无法在目标位置创建资源，因为服务器不得自动创建这些中间集合。或者，服务器无法保留活属性的行为，而仍将资源移动到目标位置（请参阅“preserved-live-properties”后置条件）。
- 412（前提条件失败）-条件header失败。特定于MOVE，这可能意味着Overwrite标头为“F”，并且目标URL已映射到某个资源。
- 423（锁定）-源或目标资源，源或目标资源父级或源或目标集合中的某些资源被锁定。该响应应包含“lock-token-submitted”的前提条件元素。
- 502（错误网关）-当目标在另一台服务器上并且目标服务器拒绝接受资源时，可能会发生这种情况。当目标位于同一服务器命名空间的另一个子节点上时，也会发生这种情况。

### 9.9.5 实例-非集合的MOVE

本示例显示资源 http://www.example.com/~fielding/index.html 被移动到位置 http://www.example.com/users/f/fielding/index.html 。如果目标URL已映射到资源，则目标资源的内容将被覆盖。在这种情况下，由于目标资源上没有任何内容，因此响应代码为201（已创建）。

请求内容：
~~~text
MOVE /~fielding/index.html HTTP/1.1 
Host: www.example.com 
Destination: http://www.example/users/f/fielding/index.html 
~~~

返回内容：
~~~text
HTTP/1.1 201 Created 
Location: http://www.example.com/users/f/fielding/index.html 
~~~

### 9.9.6 实例 - 集合的MOVE

请求内容：
~~~text
MOVE /container/ HTTP/1.1 
Host: www.example.com 
Destination: http://www.example.com/othercontainer/ 
Overwrite: F 
If: (<urn:uuid:fe184f2e-6eec-41d0-c765-01adc56e6bb4>) 
    (<urn:uuid:e454f3f3-acdc-452a-56c7-00a5c91e4b77>) 
~~~

返回内容：
~~~xml
HTTP/1.1 207 Multi-Status 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 

<?xml version="1.0" encoding="utf-8" ?> 
<d:multistatus xmlns:d='DAV:'> 
    <d:response> 
        <d:href>http://www.example.com/othercontainer/C2/</d:href> 
        <d:status>HTTP/1.1 423 Locked</d:status> 
        <d:error><d:lock-token-submitted/></d:error>
    </d:response> 
</d:multistatus> 
~~~

在此示例中，客户端已随请求提交了两个锁定令牌。在方法涉及范围内任何被锁定的位置，都需要为源和目标的每个资源提交锁定令牌。 在这种情况下，没有为目标 http://www.example.com/othercontainer/C2/ 提交正确的锁定令牌。这意味着无法移动资源/container/C2/。由于移动/container/C2/时出错，因此/container/C2的成员均未移动。但是，出于错误最小化规则，未列出这些成员的错误。用户身份验证以前是通过HTTP协议范围之外的机制在基础传输层中进行的。

## 9.10 LOCK方法

以下各节介绍LOCK方法，该方法用于取得任何访问类型的锁并刷新现有的锁。LOCK方法的这些章节仅描述LOCK方法特有的那些语义，并且与所请求锁的访问类型无关。

任何支持LOCK方法的资源都必须至少支持本文定义的XML请求和响应格式。

此方法既不是幂等也不安全（请参阅[RFC2616]的9.1节）。不得缓存对此方法的响应。

### 9.10.1 在现有资源上创建锁

对现有资源的LOCK请求将在Request-URI标识的资源上创建一个锁，前提是该资源尚未被冲突的锁锁定。Request-URI中标识的资源将成为锁的根。创建新锁的LOCK方法请求必须具有XML request body。服务器必须保存客户端在LOCK请求中的“owner”元素中提供的信息。LOCK请求可能具有Timeout header。

创建新锁后，LOCK响应：
- 必须在prop XML元素中包含具有DAV:lockdiscovery属性值的body。里面必须包含有关刚刚授予的锁的完整信息，而有关其他（共享）锁的信息是可选的。
- 必须包含Lock-Token response header以及与新锁关联的token。

### 9.10.2 刷新锁

通过向目标锁定范围资源的URL发送LOCK请求来刷新锁定。该请求必须没有body主体，并且必须使用带有单个锁令牌的“If” header来指定要刷新的锁（一次只能刷新一个锁）。该请求可能包含一个Timeout header，服务器可以接受该header并将锁上剩余的持续时间重置为新值（也有可能服务器会忽略这一设定而采用自己的逻辑来为计时器赋值）。服务器必须在LOCK刷新时忽略Depth header。

如果资源具有其他（共享）锁，则这些锁将不受锁刷新的影响。同时这些锁也不会阻止你刷新目标锁。

一个刷新LOCK请求成功后，响应中不会返回Lock-Token header，但是LOCK response body必须包含DAV:lockdiscovery属性的新值。

### 9.10.3 Depth和LOCK

Depth header可以与LOCK方法一起使用。除0或“infinity”以外的其他值不能被LOCK方法的Depth header所接受。所有支持LOCK方法的资源都必须支持Depth header。

值为0的Depth header意味着仅锁定Request-URI直接指定的资源。

如果Depth header设置为“infinity”，则将锁定Request-URI中指定的资源本身及其所有层级的后代成员。锁定成功后必须返回单个锁token。同样，如果在此令牌上成功执行了UNLOCK，则所有关联的资源都将被解锁。因此，对于LOCK或UNLOCK来说不存在部分成功，要么整个层次结构都被锁定，或者没有任何资源被锁定。

如果无法成功地将锁授予所有资源，则服务器必须返回一个Multi-Status response，其中包含至少一个response元素，这类response元素由阻止授予该锁定的资源url进行标识，同时附带上各自对应的适当状态代码（例如，403（禁止）或423（已锁定））。此外，如果导致失败的资源不是被请求的资源，则服务器也应为Request-URI创建一个“response”元素，它的“status”子元素包含424（失败的依赖关系）错误码。

如果未在LOCK请求中提交任何Depth header，则该请求必须像被提交了“Depth:infinity” header一样起作用。

### 9.10.4 锁定未映射的URL

一个成功的LOCK方法在被请求URL对应的（非集合）资源不存在时必须创建（新的）空资源。稍后锁可能消失，但空资源仍然存在。此后，再有应答范围内包含此空资源的PROPFIND被请求时，response里面必须要包含这一空资源。服务器对于指向此空资源的GET请求必须以204（No Content）或着Content-Length header为0的200（OK）状态码来响应。

### 9.10.5 锁兼容性表

下表描述了对资源进行锁定请求时发生的行为。

|资源当前的锁状态|可否继续授予共享锁|可否继续授予排它锁|
|---|---|---|
|None - 没有锁|True|True|
|Shared Lock - 已被共享锁定|True|False|
|Exclusive Lock - 已被排它锁定|False|False*|

说明：True = 可以授予锁定。 False = 不能授予锁定。 * = 主体两次请求相同的锁是非法的。

资源的当前锁定状态在最左列中给出，行和列的交集给出了锁定请求的结果。例如，如果在资源上持有共享锁，并且请求了排他锁，则表条目为“false”，指示不得授予该锁。

### 9.10.6 LOCK响应

除了可能的常规状态码外，以下状态码也对LOCK结果适用：
- 200（OK）-LOCK请求成功，并且DAV:lockdiscovery属性的值包含在response body中。
- 201（已创建）-LOCK请求是针对未映射URL的，该请求成功并导致创建了新资源，并且DAV:lockdiscovery属性的值包含在response body中。
- 409（冲突）-在创建一个或多个中间集合之前，无法在目标位置创建资源。服务器不得自动创建这些中间集合。
- 423（已锁定），可能带有“no-conflicting-lock”前提条件代码：资源上已存在与请求的锁不兼容的锁（请参见上面的锁兼容性表）。
- 412（前提条件失败），带有“lock-token-matches-request-uri”前提条件代码。LOCK请求是通过If标头发出的，客户端希望刷新给定的锁，但是Request-URI与令牌标识的锁无法匹配，这个锁的作用范围可能不包含Request-URI，或者锁可能已消失，或者令牌可能无效。

### 9.10.7 实例 - 简单的LOCK请求

请求内容：
~~~xml
LOCK /workspace/webdav/proposal.doc HTTP/1.1 
Host: example.com 
Timeout: Infinite, Second-4100000000 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 
Authorization: Digest username="ejw", 
    realm="ejw@example.com", nonce="...", 
    uri="/workspace/webdav/proposal.doc", 
    response="...", opaque="..." 

<?xml version="1.0" encoding="utf-8" ?> 
<D:lockinfo xmlns:D='DAV:'> 
    <D:lockscope><D:exclusive/></D:lockscope> 
    <D:locktype><D:write/></D:locktype> 
    <D:owner> 
        <D:href>http://example.org/~ejw/contact.html</D:href> 
    </D:owner> 
</D:lockinfo> 
~~~

返回内容：
~~~xml
HTTP/1.1 200 OK 
Lock-Token: <urn:uuid:e71d4fae-5dec-22d6-fea5-00a0c91e6be4> 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 

<?xml version="1.0" encoding="utf-8" ?> 
<D:prop xmlns:D="DAV:"> 
    <D:lockdiscovery> 
        <D:activelock> 
            <D:locktype><D:write/></D:locktype> 
            <D:lockscope><D:exclusive/></D:lockscope> 
            <D:depth>infinity</D:depth> 
            <D:owner> 
                <D:href>http://example.org/~ejw/contact.html</D:href> 
            </D:owner> 
            <D:timeout>Second-604800</D:timeout> 
            <D:locktoken> 
                <D:href>urn:uuid:e71d4fae-5dec-22d6-fea5-00a0c91e6be4</:href>
            </D:locktoken> 
            <D:lockroot> 
                <D:href>http://example.com/workspace/webdav/proposal.oc</D:href>
            </D:lockroot> 
        </D:activelock> 
    </D:lockdiscovery> 
</D:prop>
~~~

本示例显示了如何在资源 http://example.com/workspace/webdav/proposal.doc 上成功创建独占写入锁定。资源 http://example.org/~ejw/contact.html 包含锁创建者的联系信息。服务器在此资源上制定了基于活跃程度的超时策略，该策略导致1周（604800秒）后自动删除锁定。请注意，LOCK请求的Authorization header中有nonce，response和opaque等字段，其意义和用法这里暂时略过，后面的章节会有详细说明。

### 9.10.8 实例 - 刷新一个写入锁

请求内容：
~~~text
LOCK /workspace/webdav/proposal.doc HTTP/1.1 
Host: example.com 
Timeout: Infinite, Second-4100000000 
If: (<urn:uuid:e71d4fae-5dec-22d6-fea5-00a0c91e6be4>) 
Authorization: Digest username="ejw", 
    realm="ejw@example.com", nonce="...", 
    uri="/workspace/webdav/proposal.doc", 
    response="...", opaque="..." 
~~~

返回内容：
~~~xml
HTTP/1.1 200 OK 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 

<?xml version="1.0" encoding="utf-8" ?> 
<D:prop xmlns:D="DAV:"> 
    <D:lockdiscovery> 
        <D:activelock> 
            <D:locktype><D:write/></D:locktype> 
            <D:lockscope><D:exclusive/></D:lockscope> 
            <D:depth>infinity</D:depth> 
            <D:owner> 
                <D:href>http://example.org/~ejw/contact.html</D:href> 
            </D:owner> 
            <D:timeout>Second-604800</D:timeout> 
            <D:locktoken> 
                <D:href>urn:uuid:e71d4fae-5dec-22d6-fea5-00a0c91e6be4</D:href> 
            </D:locktoken> 
            <D:lockroot> 
                <D:href>http://example.com/workspace/webdav/proposal.doc</D:href> 
            </D:lockroot> 
        </D:activelock> 
    </D:lockdiscovery> 
</D:prop> 
~~~

该请求将刷新锁，尝试将超时时间重置为Timeout header中指定的新值。注意，客户端请求希望锁无限有效（不超时），但是服务器忽略了该请求。在此示例中，同样未演示Authentication header中相关校验字段的使用。

### 9.10.9 实例 - 请求多资源锁（对集合的无限层级锁）

请求内容：
~~~xml
LOCK /webdav/ HTTP/1.1 
Host: example.com 
Timeout: Infinite, Second-4100000000 
Depth: infinity 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 
Authorization: Digest username="ejw", 
    realm="ejw@example.com", nonce="...", 
    uri="/workspace/webdav/proposal.doc", 
    response="...", opaque="..." 
    
<?xml version="1.0" encoding="utf-8" ?> 
<D:lockinfo xmlns:D="DAV:"> 
    <D:locktype><D:write/></D:locktype> 
    <D:lockscope><D:exclusive/></D:lockscope> 
    <D:owner> 
        <D:href>http://example.org/~ejw/contact.html</D:href> 
    </D:owner> 
</D:lockinfo> 
~~~

返回内容：
~~~xml
HTTP/1.1 207 Multi-Status 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 

<?xml version="1.0" encoding="utf-8" ?> 
<D:multistatus xmlns:D="DAV:"> 
    <D:response> 
        <D:href>http://example.com/webdav/secret</D:href> 
        <D:status>HTTP/1.1 403 Forbidden</D:status> 
    </D:response> 
    <D:response> 
        <D:href>http://example.com/webdav/</D:href> 
        <D:status>HTTP/1.1 424 Failed Dependency</D:status> 
    </D:response> 
</D:multistatus> 
~~~ 

此示例显示了对集合及其所有后代子项进行排他写入锁定的请求。在此请求中，客户端指定希望使用无限长锁定（如果服务器支持的话），否则需要41亿秒的超时（如果服务器支持）。请求body包含了尝试获取该锁的主体的联系信息，这里是一个网页URL。

返回的错误是资源 http://example.com/webdav/secret 上的403（禁止）响应。由于无法锁定此资源，因此此次请求中没有资源被锁定。还要注意，Request-URI本身的“response”元素已按要求包括在内。

在此示例中，未演示Authentication header中相关校验字段的使用。

## 9.11 UNLOCK方法

UNLOCK方法用来删除由Lock-Token header中的锁token指向的锁。Request-URI必须标识锁范围内的资源。

请注意，使用Lock-Token header提供锁token的用法与其他状态更改方法不太一样，其他方法都需要通过提交带有锁令牌的If header（来让服务器识别锁的信息），而UNLOCK（由于已经有了Lock-Token header来（通过锁根）提供锁token，所以）不需要再用If header来提供锁token。当然，如果请求中确实存在If header，则其作为条件标头也具有其正常含义。

为了成功响应此方法，服务器必须完全删除锁。

如果所有被（此次提交的锁定令牌所对应的锁）锁定的资源都无法解锁，则UNLOCK请求必须失败。
对UNLOCK方法的成功响应并不意味着资源都已经被解锁，而是意味着对应于指定令牌的这个锁已不存在。

任何支持LOCK方法的兼容DAV的资源都必须支持UNLOCK方法。

此方法是幂等的，但不安全（请参阅[RFC2616]的9.1节）。不得缓存对此方法的响应。

### 9.11.1 状态码

除可能的常规状态码外，以下状态码对UNLOCK具有特定的适用性：
- 204（无响应内容）-正常的成功响应（而不是200 OK，因为200 OK表示有响应body，而UNLOCK成功响应通常不包含body）。
- 400（错误请求）-未提供要解锁的令牌。
- 403（禁止）-当前经过身份验证的主体无权删除该锁。
- 409（冲突），带有“lock-token-matches-request-uri”前提条件：资源未锁定，或者对不在锁定范围内的Request-URI进行了请求。

### 9.11.2 实例 - UNLOCK

请求内容：
~~~text
UNLOCK /workspace/webdav/info.doc HTTP/1.1 
Host: example.com 
Lock-Token: <urn:uuid:a515cfa4-5da4-22e1-f5b5-00a0451e6bf7> 
Authorization: Digest username="ejw" 
    realm="ejw@example.com", nonce="...", 
    uri="/workspace/webdav/proposal.doc", 
    response="...", opaque="..." 
~~~

返回内容：
~~~text
HTTP/1.1 204 No Content 
~~~

在此示例中，成功从资源 http://example.com/workspace/webdav/info.doc 中删除了由锁令牌“urn:uuid:a515cfa4-5da4-22e1-f5b5-00a0451e6bf7”所标识的锁。如果包含此锁的资源不止一个，那么将从所有资源中进行删除。

在此示例中，未演示Authentication header中相关校验字段的使用。