export default interface HttpErrorResponse {
	error: {
		status: number
		name: string
		message: string
	}
}
