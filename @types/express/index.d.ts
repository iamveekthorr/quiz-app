declare namespace Express {
  export interface Request {
    requestTime?: string;
  }
}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      DATABASE_URL: string;
      DATABASE_PASSWORD: string;
    }
  }
}

declare module 'xss-clean' {
  const value: Function;
  export default value;
}
