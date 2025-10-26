class Cliente {
  final int? id;
  final String nome;
  final String email;
  final String telefone;
  final String cidade;

  Cliente({
    this.id,
    required this.nome,
    required this.email,
    required this.telefone,
    required this.cidade,
  });

  // Converter JSON para objeto Cliente
  factory Cliente.fromJson(Map<String, dynamic> json) {
    return Cliente(
      id: json['id'],
      nome: json['nome'],
      email: json['email'],
      telefone: json['telefone'],
      cidade: json['cidade'],
    );
  }

  // Converter objeto Cliente para JSON
  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'nome': nome,
      'email': email,
      'telefone': telefone,
      'cidade': cidade,
    };
  }

  // Criar cópia do objeto com modificações
  Cliente copyWith({
    int? id,
    String? nome,
    String? email,
    String? telefone,
    String? cidade,
  }) {
    return Cliente(
      id: id ?? this.id,
      nome: nome ?? this.nome,
      email: email ?? this.email,
      telefone: telefone ?? this.telefone,
      cidade: cidade ?? this.cidade,
    );
  }
}
