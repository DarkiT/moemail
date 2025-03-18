import { NextResponse } from "next/server"
import { getRequestContext } from "@cloudflare/next-on-pages"

export async function getMailDomains() {
    const env = getRequestContext().env
    const emailDomainsStr = await env.SITE_CONFIG.get("EMAIL_DOMAINS") || "moemail.app"
    
    // 将字符串按逗号分割为数组，并去除两端空格
    const emailDomains = emailDomainsStr.split(',').map((domain: string) => domain.trim())
  
    return Response.json({
      emailDomains: emailDomains
    })
}

export async function handleApiMailDomains() {
    try {
      const response = await getMailDomains()
      const { emailDomains } = await response.json()
      
      // 直接返回获取到的域名数组
      return NextResponse.json({
        domains: emailDomains,
        count: emailDomains.length,
        success: true
      })
      
    } catch (error: any) {
      // 记录错误信息，解决 error 变量未使用的问题
      console.error("获取邮箱域名失败:", error?.message || "未知错误");
      
      return NextResponse.json(
        { error: "服务器内部错误", success: false },
        { status: 500 }
      )
    }
}