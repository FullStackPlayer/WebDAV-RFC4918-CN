# 附录D. Lock-null 资源

最初的WebDAV模型为锁定未映射URL创建了“lock-null resources”。该模型过于复杂，并且发现了一些互操作性和实现问题。所以在新WebDAV模型（请参见第7.3节）中创建了“locked empty resources”来解决这一问题。lock-null resources已经被废弃。本节简要讨论这一原始模型，是因为客户端必须能够处理任何一个模型。

在原始的“lock-null resource”模型（不再建议实现该模型）中：

- 一个lock-null resource有时显示为“Not Found”。服务器以404或405响应除PUT，MKCOL，OPTIONS，PROPFIND，LOCK和UNLOCK之外的任何方法。
- 但是lock-null resource确实会显示为其父集合的成员。
- 如果服务器的锁在lock-null resource转换为常规资源之前消失了，则服务器将完全删除该锁为空的资源（其URI变为未映射）。回想一下，锁不仅会在过期或被解锁时消失，在资源被重命名或移动或任何父集合被重命名或移动时也会被删除。
- 如果对URL的PUT请求成功，则服务器会将lock-null resource转换为常规资源。
- 如果对URL的MKCOL请求成功，则服务器会将空锁资源转换为集合（尽管互操作性经验表明并非所有服务器都遵循此要求）。
- 为DAV:lockdiscovery和DAV:supportedlock属性定义了属性值，但为DAV:getcontenttype等其他属性定义属性值不是必须的。
- 客户端可以与服务器进行新旧两种方式的互动，方法是尝试在LOCK一个未映射URL之后提交一个PUT而非MKCOL或者GET来判断服务器是哪种模式。

## D.1 客户端使用LOCK创建资源指南

为此规范实现的WebDAV客户端可能会遇到创建lock-null resource的服务器（使用[RFC2518]在此规范之前实现），也有可能创建locked empty resource的服务器。对LOCK请求的响应不会指示服务器属于哪种。有几种技术可以帮助客户端处理这两种类型：

- 如果客户端希望避免意外创建lock-null或为locked empty的锁定资源，则LOCK请求中可以包含“If-Match:*”标头，以防止服务器创建新资源。

- 如果LOCK请求创建了一个资源，并且客户端随后想要使用COPY或MOVE请求覆盖该资源，则客户端应包括“Overwrite:T”标头。

- 如果LOCK请求创建了一个资源，然后客户端决定处理掉该资源，则DELETE请求会在lock-null的资源上失败，想达到目的应该使用UNLOCK。但是对于locked empty resource，UNLOCK不会使资源消失。因此，客户端可能必须尝试两个请求，而忽略两个请求之一中的错误。