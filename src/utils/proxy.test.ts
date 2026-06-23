import { afterEach, describe, expect, test } from 'bun:test'
import { getProxyFetchOptions, shouldBypassProxy } from './proxy.js'

const originalEnv = {
  HTTP_PROXY: process.env.HTTP_PROXY,
  HTTPS_PROXY: process.env.HTTPS_PROXY,
  http_proxy: process.env.http_proxy,
  https_proxy: process.env.https_proxy,
  NO_PROXY: process.env.NO_PROXY,
  no_proxy: process.env.no_proxy,
}

function restoreEnv() {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
}

describe('proxy environment handling', () => {
  afterEach(restoreEnv)

  test('bypasses proxy fetch options for loopback provider proxy targets', () => {
    process.env.HTTP_PROXY = 'http://127.0.0.1:1181'
    process.env.HTTPS_PROXY = 'http://127.0.0.1:1181'
    process.env.NO_PROXY = 'localhost,127.0.0.1,::1'
    delete process.env.http_proxy
    delete process.env.https_proxy
    delete process.env.no_proxy

    expect(shouldBypassProxy('http://127.0.0.1:3456/proxy/providers/p1/v1/messages')).toBe(true)
    expect(getProxyFetchOptions({
      forAnthropicAPI: true,
      targetUrl: 'http://127.0.0.1:3456/proxy/providers/p1',
    }).proxy).toBeUndefined()
  })

  test('keeps proxy fetch options for external provider targets', () => {
    process.env.HTTP_PROXY = 'http://127.0.0.1:1181'
    process.env.HTTPS_PROXY = 'http://127.0.0.1:1181'
    process.env.NO_PROXY = 'localhost,127.0.0.1,::1'
    delete process.env.http_proxy
    delete process.env.https_proxy
    delete process.env.no_proxy

    expect(shouldBypassProxy('https://api.example.com/v1/messages')).toBe(false)
    expect(getProxyFetchOptions({
      forAnthropicAPI: true,
      targetUrl: 'https://api.example.com',
    }).proxy).toBe('http://127.0.0.1:1181')
  })
})
