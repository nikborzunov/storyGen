class Logger {
  private static instances: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!this.instances) {
      this.instances = new Logger();
    }
    return this.instances;
  }

  public log(message: string, ...optionalParams: any[]) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }

  public error(message: string, ...optionalParams: any[]) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }

  public warn(message: string, ...optionalParams: any[]) {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }

  public info(message: string, ...optionalParams: any[]) {
    console.info(`[INFO] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }
}

export const logger = Logger.getInstance();