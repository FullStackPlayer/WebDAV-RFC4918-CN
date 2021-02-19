# 附录E. 客户认证激活指南

许多已经实现的WebDAV客户端都有帐户设置（类似于电子邮件客户端存储IMAP帐户设置的方式）。因此，WebDAV客户端将能够使用其对服务器开始时的请求通过提供真名、nonce、其它信息来进行身份验证。请注意，某些请求的结果可能会根据客户端是否通过身份验证而有所不同：如果客户端通过身份验证，则PROPFIND可能会返回更多可见资源，但如果客户端是匿名的，则PROPFIND也不会失败。

客户端可能有多种方式可以触发服务器来提供身份验证质询。本附录描述了几种可行的方法：

第一种方法是执行一个应该会要求身份验证的请求。但是有这样一种可能，即使没有身份验证的情况下，服务器也会处理任何请求，因此，为了完全可靠，客户端可以添加条件标头，以确保：即使请求通过了权限检查，服务器也不会真正处理该请求。遵循此方法的一个示例是将PUT请求与带有不存在的ETag值的“If-Match”标头一起使用。如果服务器在按要求测试条件之前未测试授权（请参阅第8.5节，这是错误的），或者服务器不需要测试授权，那么此方法可能不会导致身份验证挑战。

示例 - 使用写入请求强制进行身份验证质询
请求内容：
~~~text
PUT /forceauth.txt HTTP/1.1 
Host: www.example.com 
If-Match: "xxx"
Content-Type: text/plain
Content-Length: 0
~~~

第二种方法是使用Authorization标头（在[RFC2617]中定义），该标头很可能被服务器拒绝，但随后将提示适当的身份验证质询。例如，客户端可以从包含授权头的PROPFIND请求开始，该授权头包含伪造的Basic userid/password字符串或实际的可信凭证。如果服务器接收到带有未识别的用户名或无效密码的Authorization标头，很有可能根本不去处理Basic身份验证，而直接以“401 Unauthorized”响应并发起验证质询。由于RFC 2617的要求，这应该会起作用：

> “如果原始服务器不希望接受与请求一起发送的凭据，则它应返回401（未经授权）响应。该响应必须包含WWW-Authenticate标头字段，其中至少包含一个适用于鉴权挑战的（可能是新的）资源。”

在某些情况下，实施该建议会有一个小问题，因为某些服务器甚至没有某些资源的质询信息。因此，当无法对资源进行身份验证或该资源在所有接受的方法上完全公开可用时，服务器可能会忽略Authorization标头，并且客户端可能稍后叫会重试。

示例 - 使用Authorization标头强制进行身份验证质询
请求内容：
~~~text
PROPFIND /docs/ HTTP/1.1 
Host: www.example.com 
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Content-type: application/xml; charset="utf-8" 
Content-Length: xxxx 
        
[body omitted]
~~~