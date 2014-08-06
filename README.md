 Code Craft - ComplexType
=========================

> [Aeon Digital](http://www.aeondigital.com.br)
>
> rianna@aeondigital.com.br


**Code Craft** é um conjunto de soluções front-end e outras server-side para a construção de aplicações web.
Tais soluções aqui apresentadas são a minha forma de compartilhar com a `comunidade online` parte do que aprendi 
(e continuo aprendendo) nos foruns, sites, blogs, livros e etc. assim como na experiência adquirida no contato
direto com profissionais e estudantes que, como eu, amam o universo `Web Developer` e nunca se dão por satisfeitos 
com seu nível atual de conhecimento.


## C.C. - ComplexType

**ComplexType** permite criar tipos complexos de dados, agregando a estes validação e formatações.
Esta classe apenas devolve um objeto do tipo *ComplexType* a partir dos dados informados.



### Criação de objeto:


var nType = CodeCraft.CreateNewType(parName, parType, parLength, parMin, parMax, 
                                    parRefType, parAllowSet, parAllowNull, parAllowEmpty, 
                                    parUnique, parReadOnly, parDefault, parFormatSet)

#### Parametros : 

* `parName`                     : Nome da coluna.
* `parType`                     : Tipo de dado primitivo aceito.
* `parLength`                   : Tamanho máximo para um campo do tipo String. [padrão = null]
* `parMin`                      : Valor mínimo aceito para um campo numérico. [padrão = null]
* `parMax`                      : Valor máximo aceito para um campo numérico. [padrão = null]
* `parRefType`                  : Nome do tipo ao qual este deve ser uma referência. [padrão = null]
* `parAllowSet`                 : Indica que o valor pode ser setado pelo usuário. [padrão = true]
* `parAllowNull`                : Indica se permite que o valor seja nulo. [padrão = true]
* `parAllowEmpty`               : Indica se permite que o valor seja vazio ['']. [padrão = false]
* `parUnique`                   : Indica que este valor não deve ser repetido em uma coleção de objetos deste tipo. [padrão = false]
* `parReadOnly`                 : Indica que o valor só será setado 1 vez. [padrão = false]
* `parDefault`                  : Valor inicial para uma variável deste tipo. [padrão = null]
* `parFormatSet`                : Objeto de definições para formatação. [padrão = null]



#### Métodos do Objeto.

* `CheckValue`                  : Verifica um valor informado frente as configurações do próprio objeto.


#### Dependências

As seguintes bibliotecas são necessárias :

* [BasicTools](http://github.com/AeonDigital/Code-Craft-js_BasicTools)
* [StringExtension](http://github.com/AeonDigital/Code-Craft-js_StringExtension) - Opcional, porém, recomendável.


**Importante**

Tenha em mente que em algumas vezes, neste e em outros projetos **Code Craft** optou-se de forma consciênte em 
não utilizar uma ou outra *regra de otimização* dos artefatos de software quando foi percebida uma maior vantagem para
a equipe de desenvolvimento em flexibilizar tal ponto do que extritamente seguir todas as regras de otimização.


### Compatibilidade

Não é intenção deste nem de outros projetos do conjunto de soluções **Code Craft** em manter 
compatibilidade com navegadores antigos (IE8<).


________________________________________________________________________________________________________________________



## Licença

Para este e outros projetos **Code Craft** é utilizada a [Licença GNUv3](LICENCE.md).
