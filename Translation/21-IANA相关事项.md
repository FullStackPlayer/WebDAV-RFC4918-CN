# 21. IANA注意事项

## 21.1 新的URI schemes

该规范定义了两个URI schemes：
- 附录C中定义的“opaquelocktoken”方案，以及
- “DAV” URI方案，该方案过去曾在[RFC2518]中使用，以消除WebDAV属性和XML元素名称的歧义，并且在本规范和扩展WebDAV的其他规范中继续用于该目的。在“DAV:”命名空间中标识符的创建由IETF控制。

请注意，现在不建议为XML名称空间定义新的URI方案。在标准最佳实践出现之前就定义了“DAV:”。

## 21.2 XML命名空间

XML名称空间可消除WebDAV属性名称和XML元素的歧义。任何WebDAV用户或应用程序都可以定义新的名称空间，以创建自定义属性或扩展WebDAV XML语法。 IANA不需要管理此类名称空间，属性名称或元素名称。

## 21.3 Message Header字段

下面的消息头字段应添加到永久注册表中（请参阅[RFC3864]）。

### 21.3.1 DAV

标头字段名称: DAV

适用协议: http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第10.1节）

### 21.3.2 Depth

标头字段名称：Depth

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第10.2节）

### 21.3.3 Destination

标头字段名称：Destination

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第10.3节）

### 21.3.4 If

标头字段名称：If

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第10.4节）

### 21.3.5 Lock-Token

标头字段名称：Lock-Token

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第10.5节）

### 21.3.6 Overwrite

标头字段名称：Overwrite

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第10.6节）

### 21.3.7 Timeout

标头字段名称：Timeout

适用协议：http

状态：standard

作者/变更控制者：IETF

规范文件：本规范（第10.7节）

## 21.4 HTTP状态码

本规范定义的HTTP状态代码
- 207多状态（第11.1节）
- 422无法处理的实体（第11.2节），
- 423已锁定（第11.3节），
- 424依存关系失败（第11.4节）和
- 507储存空间不足（第11.5节），

会在<http://www.iana.org/assignments/http-status-codes>的注册表中进行更新。

注意：在本规范中，HTTP状态代码102（正在处理）已被删除；其IANA注册应继续参考RFC 2518。