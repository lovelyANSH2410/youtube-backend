class ApiResponse {
    constructor(data, message = "Success", statusCode = 200) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.success = true;
    }
}

export default ApiResponse;
