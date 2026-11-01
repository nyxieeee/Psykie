import { createHandler } from '../_shared/handler.ts'
declare const Deno: { env: { get(key: string): string | undefined }; serve(handler: (request: Request) => Promise<Response>): void }
Deno.serve(createHandler({ env: key => Deno.env.get(key), fetch }, 'research'))
