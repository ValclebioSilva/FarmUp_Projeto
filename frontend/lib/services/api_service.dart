import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/cliente.dart';

class ApiService {
  // Carrega URL e Token do arquivo .env
  static String get baseUrl => dotenv.env['BASE_URL'] ?? 'http://localhost:3002';
  static String get apiToken => dotenv.env['API_TOKEN'] ?? '';
  
  // Headers padrão com autenticação
  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $apiToken',
  };

  // GET /clientes - Listar todos os clientes
  Future<List<Cliente>> getClientes({String? cidade, String? nome}) async {
    try {
      String url = '$baseUrl/clientes';

      // Adicionar query parameters se fornecidos
      List<String> queryParams = [];
      if (cidade != null && cidade.isNotEmpty) {
        queryParams.add('cidade=$cidade');
      }
      if (nome != null && nome.isNotEmpty) {
        queryParams.add('nome=$nome');
      }

      if (queryParams.isNotEmpty) {
        url += '?${queryParams.join('&')}';
      }

      final response = await http.get(Uri.parse(url), headers: _headers);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<dynamic> clientesJson = data['clientes'];
        return clientesJson.map((json) => Cliente.fromJson(json)).toList();
      } else {
        throw Exception('Erro ao carregar clientes: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erro de conexão: $e');
    }
  }

  // GET /clientes/:id - Buscar cliente por ID
  Future<Cliente> getCliente(int id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/clientes/$id'), headers: _headers);

      if (response.statusCode == 200) {
        return Cliente.fromJson(json.decode(response.body));
      } else if (response.statusCode == 404) {
        throw Exception('Cliente não encontrado');
      } else {
        throw Exception('Erro ao buscar cliente: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erro de conexão: $e');
    }
  }

  // POST /clientes - Criar novo cliente
  Future<Cliente> createCliente(Cliente cliente) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/clientes'),
        headers: _headers,
        body: json.encode(cliente.toJson()),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        return Cliente.fromJson(data['cliente']);
      } else if (response.statusCode == 409) {
        final data = json.decode(response.body);
        throw Exception(data['error']);
      } else if (response.statusCode == 400) {
        final data = json.decode(response.body);
        throw Exception(data['error']);
      } else {
        throw Exception('Erro ao criar cliente: ${response.statusCode}');
      }
    } catch (e) {
      if (e is Exception) rethrow;
      throw Exception('Erro de conexão: $e');
    }
  }

  // PUT /clientes/:id - Atualizar cliente
  Future<Cliente> updateCliente(int id, Cliente cliente) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/clientes/$id'),
        headers: _headers,
        body: json.encode(cliente.toJson()),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Cliente.fromJson(data['cliente']);
      } else if (response.statusCode == 404) {
        throw Exception('Cliente não encontrado');
      } else if (response.statusCode == 409) {
        final data = json.decode(response.body);
        throw Exception(data['error']);
      } else if (response.statusCode == 400) {
        final data = json.decode(response.body);
        throw Exception(data['error']);
      } else {
        throw Exception('Erro ao atualizar cliente: ${response.statusCode}');
      }
    } catch (e) {
      if (e is Exception) rethrow;
      throw Exception('Erro de conexão: $e');
    }
  }

  // DELETE /clientes/:id - Excluir cliente
  Future<void> deleteCliente(int id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/clientes/$id'), headers: _headers);

      if (response.statusCode == 200) {
        return;
      } else if (response.statusCode == 404) {
        throw Exception('Cliente não encontrado');
      } else {
        throw Exception('Erro ao excluir cliente: ${response.statusCode}');
      }
    } catch (e) {
      if (e is Exception) rethrow;
      throw Exception('Erro de conexão: $e');
    }
  }
}
