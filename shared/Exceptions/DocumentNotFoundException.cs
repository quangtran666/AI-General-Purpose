namespace shared.Exceptions;

public class DocumentNotFoundException(int id) : Exception($"Document {id} not found");