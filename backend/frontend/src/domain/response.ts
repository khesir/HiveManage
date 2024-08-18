class Response<T> {
  timeStamp: string;
  statusCode: number;
  httpStatus: string;
  message: string;
  data: T;

  constructor(statusCode: number, httpStatus: string, message: string, data: T) {
    this.timeStamp = new Date().toLocaleString();
    this.statusCode = statusCode;
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
  }
}

export default Response;