# 15. DAV属性

对于DAV属性，属性的名称也与包含其值的XML元素的名称相同。在下面的内容中，每个部分的最后一行使用[REC-XML]中定义的格式给出元素类型声明。“value”字段（如果存在）使用BNF指定对XML元素的内容进行限制（即，进一步限制PCDATA元素的值）。

受保护的属性是不能通过PROPPATCH请求进行更改的属性。可能还有其他请求会导致对受保护属性的更改（例如，LOCK请求会影响DAV:lockdiscovery的值时）。请注意，给定的属性可以在一种类型的资源上受保护，而不能在另一种类型的资源上受保护。

计算属性是一种通过计算才能得出值的属性（基于该资源，甚至某些其他资源的内容和其他属性）。计算属性始终是受保护的属性。

COPY和MOVE行为会导向一个本地COPY和MOVE操作。

对基于HTTP GET响应标头（DAV:get*）定义的属性，header值可以包含[RFC2616]第4.2节中定义的LWS。服务器实现者应在用作WebDAV属性值之前从这些值中除去LWS。

## 15.1 creationdate

Name: creationdate

Purpose: 记录资源创建的日期和事件

Value: 日期时间（在[RFC3339]中定义，请参见第5.6节中的ABNF。）

Protected: 可能受到保护。一些服务器允许更改DAV:creationdate，以反映文档创建的时间（如果对用户更有意义）而不是上传时间。因此，客户端不应在同步逻辑中使用此属性（请改用DAV:getetag）。

COPY/MOVE behavior: 该属性值应在MOVE操作期间保留，但通常在使用COPY创建资源时会重新初始化。不应在COPY中设置。

Description: DAV:creationdate属性应在所有DAV兼容的资源上定义。如果存在，它应当包含创建资源时的时间戳。无法永久记录创建日期的服务器应改为undefined（即报告“404 未找到”）。

<!ELEMENT creationdate (#PCDATA) >

## 15.2 displayname

Name: displayname

Purpose: 提供适合呈现给用户的资源名称。

Value: 任意文字

Protected: 不应该受到保护。请注意，实施[RFC2518]的服务器可能已将此设置为受保护属性，因为这是一项新要求。

COPY/MOVE behavior: 此属性值应在COPY和MOVE操作中得以保留。

Description: 包含适合呈现给用户的资源描述。此属性是在资源上定义的，因此应具有与用于检索它的Request-URI无关的相同值（因此，基于Request-URI计算此属性已经被废弃）。虽然通用客户端可能会向最终用户显示这个属性值，但客户端UI设计人员必须理解，用于标识资源的方法仍然是URL。对DAV:displayname的更改不会向服务器发出MOVE或COPY，而只是更改单个资源上的一部分元数据。即使在同一集合中，两个资源也可以具有相同的DAV:displayname值。

<!ELEMENT displayname (#PCDATA) >

## 15.3 getcontentlanguage

Name: getcontentlanguage

Purpose: 包含了Content-Language header值（来自[RFC2616]的14.12节），因为当收到一个没有accept headers的GET时要用到它。

Value: 语言标签（语言标签在[RFC2616]的第3.10节中定义）

Protected: 不应受到保护，以便客户端可以重置语言。请注意，实施[RFC2518]的服务器可能已将此设置为受保护属性，因为这是一项新要求。

COPY/MOVE behavior: 此属性值应在COPY和MOVE操作中得以保留。

Description: 必须在任何DAV兼容的资源上定义DAV:getcontentlanguage属性，并且将其作为内容Content-Language header返回给GET请求。

<!ELEMENT getcontentlanguage (#PCDATA) >

## 15.4 getcontentlength

Name: getcontentlength

Purpose: 包含了一个不带Accept header的GET请求返回的Content-Length header。

Value: 参见[RFC2616]的14.13节。

Protected: 此属性由计算得来，因此受到保护。

Description: 必须在任何DAV兼容的资源上定义DAV:getcontentlength属性。并在响应GET请求时返回Content-Length header。

COPY/MOVE behavior: 此属性值取决于目标资源的大小，而不取决于源资源上的属性的值。

<!ELEMENT getcontentlength (#PCDATA) >

## 15.5 getcontenttype

Name: getcontenttype

Purpose: 包含了Content-Type header值（来自[RFC2616]的14.17节），因为它会被一个没有accept header的GET请求返回。

Value: 媒体类型（在[RFC2616]的3.7节中定义）

Protected: 如果服务器希望自己分配内容类型，则可能受到保护（另请参见第9.7.1节中的讨论）。

COPY/MOVE behavior: 此属性值应在COPY和MOVE操作中被保留。

Description: 必须在任何需要返回响应内容Content-Type header的任何DAV兼容资源上定义此属性。

<!ELEMENT getcontenttype (#PCDATA) >

## 15.6 getetag

Name: getetag

Purpose: 包含ETag header值（来自[RFC2616]的14.19节），因为它将会由一个没有accept header的GET返回。

Value: 实体标签（在[RFC2616]的3.11节中定义）

Protected: 必须对此值进行保护，因为此值是由服务器创建和控制的。

COPY/MOVE behavior: 此属性值取决于目标资源的最终状态，而不取决于源资源上的属性值。还要注意第8.8节中的注意事项。

Description: 必须在需要返回Etag header的任何DAV兼容资源上定义getetag属性。有关ETag语义的完整定义，请参阅RFC 2616的3.11节；有关WebDAV中ETag的讨论，请参阅8.6节。

<!ELEMENT getetag (#PCDATA) >

## 15.7 getlastmodified

Name: getlastmodified

Purpose: 包含Last-Modified header的值（来自[RFC2616]的14.29节），因为该值将由没有accept header的GET方法返回。

Value: rfc1123-date（在[RFC2616]的3.3.1节中定义）

Protected: 应该保护它，因为某些客户端可能依赖于该值来实现适当的缓存行为，或者依赖于此属性链接到的Last-Modified header的值。

COPY/MOVE behavior: 此属性值取决于目标资源的最后修改日期，而不取决于源资源上的值。请注意，某些服务器实现会把文件系统的最后修改时间作为DAV:getlastmodified的值，这样的话它就可以被保留在MOVE中，即使HTTP Last-Modified值应该更改了。请注意，由于[RFC2616]要求客户端在有可能的情况下使用ETag，因此实现ETag的服务器可以依靠客户端来设计比lastmodified属性更好的机制以进行脱机同步或缓存控制。还要注意第8.8节中的注意事项。

Description: 资源上的最后修改日期应仅反映资源正文（GET响应）中的更改。属性的更改不应导致最后修改日期发生更改，因为客户可能依赖于最后修改日期才能知道是否该覆盖现有主体。必须在任何DAV兼容的资源上定义DAV:getlastmodified属性，该资源会在响应GET请求时以这个属性的值来返回Last-Modified header。

<!ELEMENT getlastmodified (#PCDATA) >

## 15.8 lockdiscovery

Name: lockdiscovery

Purpose: 描述资源上的活动锁

Protected: 必须受到保护。客户端通过LOCK和UNLOCK而不是通过PROPPATCH来更改锁的列表。

COPY/MOVE behavior: 此属性的值取决于目标的锁状态，而不取决于源资源的锁。回顾一下，在MOVE操作中锁并没有被移动。

Description: 返回一个列表，它列出了所有拥有锁的人、锁的类型、超时类型和剩余超时时长以及相关锁令牌的列表。如果所有者信息被认为是敏感的，则可以省略。如果没有锁，但是服务器支持锁，则该属性将存在，但包含零个“ activelock”元素。如果有一个或多个锁，则资源上的每个锁都会出现一个“activelock”元素。由于写入锁的存在，此属性是不可锁定的（第7节）。

<!ELEMENT lockdiscovery (activelock)* >

## 15.8.1 实例 - 获得 DAV:lockdiscovery

请求内容：
~~~xml
PROPFIND /container/ HTTP/1.1 
Host: www.example.com 
Content-Length: xxxx 
Content-Type: application/xml; charset="utf-8" 

<?xml version="1.0" encoding="utf-8" ?> 
<D:propfind xmlns:D='DAV:'> 
    <D:prop><D:lockdiscovery/></D:prop> 
</D:propfind> 
~~~

返回内容：
~~~xml
HTTP/1.1 207 Multi-Status 
Content-Type: application/xml; charset="utf-8" 
Content-Length: xxxx 

<?xml version="1.0" encoding="utf-8" ?> 
<D:multistatus xmlns:D='DAV:'> 
    <D:response> 
        <D:href>http://www.example.com/container/</D:href> 
        <D:propstat> 
            <D:prop> 
                <D:lockdiscovery> 
                    <D:activelock> 
                        <D:locktype><D:write/></D:locktype> 
                        <D:lockscope><D:exclusive/></D:lockscope> 
                        <D:depth>0</D:depth> 
                        <D:owner>Jane Smith</D:owner> 
                        <D:timeout>Infinite</D:timeout> 
                        <D:locktoken> 
                            <D:href>urn:uuid:f81de2ad-7f3d-a1b2-4f3c-00a0c91a9d76</D:href>
                        </D:locktoken> 
                        <D:lockroot> 
                            <D:href>http://www.example.com/container/</href> 
                        </D:lockroot> 
                    </D:activelock> 
                </D:lockdiscovery> 
            </D:prop> 
            <D:status>HTTP/1.1 200 OK</D:status> 
        </D:propstat> 
    </D:response> 
</D:multistatus> 
~~~

该资源有一个无限超时时长的排他写入锁。

## 15.9 resourcetype

Name: resourcetype

Purpose: 指定资源的性质(集合或者内容)。

Protected: 应该受到保护。资源类型通常是通过创建资源的操作（MKCOL与PUT）决定的，而不是由PROPPATCH决定的。

COPY/MOVE behavior: 通常，资源的COPY / MOVE会在目标位置产生相同类型的资源。

Description: 必须在所有DAV兼容的资源上定义此属性。每个子元素标识资源所属的特定类型，例如“collection”，这是本规范定义的唯一资源类型（请参阅第14.3节）。如果该元素包含“collection”子元素以及其他无法识别的元素，则通常应将其视为集合。如果元素不包含可识别的子元素，则应将其视为非集合资源。默认值为空。该元素不能包含文本或混合内容。任何自定义子元素都被视为资源类型的标识符。

实例：一个虚构的例子来演示扩展性
~~~xml
<x:resourcetype xmlns:x="DAV:"> 
    <x:collection/> 
    <f:search-results xmlns:f="http://www.example.com/ns"/> 
</x:resourcetype> 
~~~

## 15.10 supportedlock

Name: supportedlock

Purpose: 提供资源支持的锁定功能的列表。

Protected: 必须受到保护。由服务器而不是客户端来确定支持哪些锁定机制。

COPY/MOVE behavior: 此属性值取决于目标上支持的锁的类型，而不取决于源资源上的属性的值。 服务器尝试复制内容到目标时不应尝试在目标上设置此属性。

Description: 返回一个列表，列表项是一个锁的范围和权限类型的集合体。请注意，实际内容本身由访问控制来控制，因此不需要服务器为一个无查看权限的客户端提供信息。 对于写入锁的存在，此属性不可锁定（第7节）。

<!ELEMENT supportedlock (lockentry)* >

### 15.10.1 实例 - 获得 DAV:supportedlock

请求内容：
~~~xml
PROPFIND /container/ HTTP/1.1 
Host: www.example.com 
Content-Length: xxxx 
Content-Type: application/xml; charset="utf-8" 

<?xml version="1.0" encoding="utf-8" ?> 
<D:propfind xmlns:D="DAV:"> 
    <D:prop><D:supportedlock/></D:prop> 
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
        <D:href>http://www.example.com/container/</D:href> 
        <D:propstat> 
            <D:prop> 
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