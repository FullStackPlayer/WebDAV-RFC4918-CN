module.exports = {
    "title": "WebDAV 规范文档",
    "description": "WebDAV 规范文档（RFC4918）中文版，由 FullStackplayer<fullstackplayer@outlook.com> 翻译。",
    "base": "/WebDAV-RFC4918-CN/",
    "themeConfig": {
        "nav": [
            {
                "text": "首页",
                "link": "/"
            },
            {
                "text": "Github",
                "link": "https://github.com/FullStackPlayer/WebDAV-RFC4918-CN"
            },
            {
                "text": "Gitee",
                "link": "https://gitee.com/FullStackPlayer/WebDAV-RFC4918-CN"
            },
            {
                "text": "WebDAV 相关",
                "ariaLabel": "原始资料链接",
                "items": [
                    {
                        "text": "RFC4918原文",
                        "link": "http://www.webdav.org/specs/rfc4918.html"
                    },
                    {
                        "text": "IETF相关文档集",
                        "link": "https://datatracker.ietf.org/doc/search?name=WebDAV&sort=&rfcs=on&activedrafts=on&by=group&group="
                    }
                ]
            }
        ],
        "sidebar": [
            [
                "/",
                "首页"
            ],
            "/00-扉页及目录",
            "/01-概述",
            "/02-符号公约",
            "/03-术语",
            "/04-资源属性的数据模型",
            "/05-网络资源集合",
            "/06-锁定",
            "/07-写入锁",
            "/08-一般请求和响应处理",
            "/09-WebDAV的HTTP方法",
            "/10-WebDAV的HTTP报头",
            "/11-HTTP1.1的状态码扩展",
            "/12-HTTP状态码的使用",
            "/13-多状态响应",
            "/14-XML元素定义",
            "/15-DAV属性",
            "/16-前置&后置条件XML元素",
            "/17-DAV中的XML可扩展性",
            "/18-DAV兼容级别",
            "/19-国际化注意事项",
            "/20-安全性考量",
            "/21-IANA相关事项",
            "/22-致谢",
            "/23-本规范的贡献者",
            "/24-RFC2518的作者",
            "/25-参考文献",
            "/其它信息",
            "/字符序索引",
            "/附录A-处理XML的注意事项",
            "/附录B-HTTP客户端兼容性",
            "/附录C-“opaquelocktoken”方案和URI",
            "/附录D-[Lock-Null]资源",
            "/附录E-客户认证激活指南",
            "/附录F-相比RFC2518的主要变更"
        ],
        "sidebarDepth": 3
    },
    "markdown": {
        "lineNumbers": true,
        "toc": {
            "includeLevel": [
                1,
                2
            ]
        }
    }
}