import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  AlertCircle, 
  BookmarkPlus, 
  Search, 
  Pen, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  ChevronDown,
  Clock,
  User,
  Eye,
  CheckCircle2
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipos para o fórum
interface ForumUser {
  id: string;
  name: string;
  avatar?: string | null;
  role: "student" | "moderator" | "expert";
  specialty?: string;
  postCount: number;
  joinDate: Date;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: ForumUser;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  isSolved?: boolean;
}

interface ForumComment {
  id: string;
  content: string;
  author: ForumUser;
  createdAt: Date;
  likeCount: number;
  isAnswer?: boolean;
}

// Componente para um cartão de post do fórum
const ForumPostCard = ({ post }: { post: ForumPost }) => {
  return (
    <Card className="mb-4 hover:border-primary/50 transition-colors">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {post.isSolved && (
                <span className="inline-flex items-center mr-2 text-green-500">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                </span>
              )}
              {post.title}
            </CardTitle>
            <CardDescription className="flex items-center mt-1 text-xs">
              <span>Postado por {post.author.name}</span>
              <span className="mx-1">•</span>
              <span>{formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ptBR })}</span>
              <span className="mx-1">•</span>
              <span>{post.category}</span>
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm line-clamp-2">{post.content}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-1" />
            <span>{post.likeCount}</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{post.commentCount}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{post.viewCount}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          Ler mais
        </Button>
      </CardFooter>
    </Card>
  );
};

// Componente para detalhe de um post expandido
const ForumPostDetail = ({ 
  post, 
  comments, 
  onAddComment 
}: { 
  post: ForumPost; 
  comments: ForumComment[];
  onAddComment: (content: string) => void;
}) => {
  const [commentContent, setCommentContent] = useState("");
  
  const handleSubmitComment = () => {
    if (commentContent.trim()) {
      onAddComment(commentContent);
      setCommentContent("");
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="p-6 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-xl">
                  {post.isSolved && (
                    <span className="inline-flex items-center mr-2 text-green-500">
                      <CheckCircle2 className="h-5 w-5 mr-1" />
                    </span>
                  )}
                  {post.title}
                </CardTitle>
                <Badge variant="outline">{post.category}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <BookmarkPlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center space-x-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium flex items-center">
                {post.author.name}
                {post.author.role === "expert" && (
                  <Badge className="ml-2 text-[10px] py-0" variant="default">Expert</Badge>
                )}
                {post.author.role === "moderator" && (
                  <Badge className="ml-2 text-[10px] py-0" variant="secondary">Moderador</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Postado {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ptBR })}
                {post.updatedAt && post.updatedAt > post.createdAt && (
                  <span> • editado {formatDistanceToNow(post.updatedAt, { addSuffix: true, locale: ptBR })}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p>{post.content}</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-6">
            <Button variant="outline" size="sm" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Curtir ({post.likeCount})
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Reportar
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Respostas ({comments.length})
        </h3>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais recentes</SelectItem>
            <SelectItem value="oldest">Mais antigas</SelectItem>
            <SelectItem value="votes">Mais votadas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className={comment.isAnswer ? "border-green-500" : ""}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium flex items-center">
                    {comment.author.name}
                    {comment.author.role === "expert" && (
                      <Badge className="ml-2 text-[10px] py-0" variant="default">Expert</Badge>
                    )}
                    {comment.author.role === "moderator" && (
                      <Badge className="ml-2 text-[10px] py-0" variant="secondary">Moderador</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: ptBR })}
                  </div>
                </div>
                {comment.isAnswer && (
                  <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Resposta aceita
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm">{comment.content}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>{comment.likeCount}</span>
                  <ArrowDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">Responder</Button>
                {!comment.isAnswer && post.author.id === "current-user" && (
                  <Button variant="outline" size="sm">Marcar como resposta</Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Sua resposta</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <Textarea
            placeholder="Escreva sua resposta aqui..."
            className="min-h-[120px]"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
        </CardContent>
        <CardFooter className="p-4 pt-2 flex justify-between">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSubmitComment}>Publicar resposta</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Componente de nova postagem
const NewPostForm = ({ onSubmit, onCancel }: { onSubmit: (post: Omit<ForumPost, 'id' | 'author' | 'createdAt' | 'likeCount' | 'viewCount' | 'commentCount'>) => void; onCancel: () => void }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleSubmit = () => {
    if (title.trim() && content.trim() && category) {
      onSubmit({
        title,
        content,
        category,
        tags
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Título
        </label>
        <Input
          id="title"
          placeholder="Digite um título claro e específico para sua pergunta"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Conteúdo
        </label>
        <Textarea
          id="content"
          placeholder="Descreva sua dúvida ou caso clínico com detalhes..."
          className="min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Categoria
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="caso-clinico">Caso Clínico</SelectItem>
              <SelectItem value="duvida-conceitual">Dúvida Conceitual</SelectItem>
              <SelectItem value="discussao">Discussão</SelectItem>
              <SelectItem value="compartilhamento">Compartilhamento</SelectItem>
              <SelectItem value="recursos">Recursos de Estudo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="tags" className="text-sm font-medium">
            Tags
          </label>
          <div className="flex space-x-2">
            <Input
              id="tags"
              placeholder="Adicione tags relevantes"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag}>
              Adicionar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                {tag}
                <button 
                  className="ml-1 text-xs opacity-70 hover:opacity-100"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim() || !category}>
          Publicar
        </Button>
      </div>
    </div>
  );
};

// Componente principal da página do fórum
export default function Forum() {
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: "1",
      title: "Dúvida sobre abordagem em paciente com suspeita de abdome agudo",
      content: "Olá colegas, estou com dificuldade em um caso clínico específico. Paciente do sexo masculino, 45 anos, chega ao pronto-socorro com dor abdominal intensa iniciada há 8 horas, localizada inicialmente em epigástrio e que posteriormente migrou para fossa ilíaca direita. Apresenta náuseas, vômitos e febre (38.2°C). Ao exame físico, sinal de Blumberg positivo. Hemograma mostra leucocitose com desvio à esquerda. Qual seria a melhor conduta neste caso? Devo solicitar TC de abdome ou já encaminhar para cirurgia?",
      author: {
        id: "user1",
        name: "Dr. Carlos Mendes",
        avatar: undefined,
        role: "student",
        postCount: 12,
        joinDate: new Date("2024-02-15")
      },
      category: "caso-clinico",
      tags: ["cirurgia", "abdome-agudo", "emergência"],
      createdAt: new Date("2025-04-25T14:32:00"),
      likeCount: 8,
      viewCount: 142,
      commentCount: 5,
      isSolved: true
    },
    {
      id: "2",
      title: "Abordagem atual do tratamento de hipertensão resistente",
      content: "Gostaria de discutir as abordagens mais recentes no tratamento de hipertensão arterial resistente. Tenho uma paciente de 62 anos, sexo feminino, com hipertensão arterial há 15 anos, diabética, em uso de Losartana 100mg/dia, Anlodipino 10mg/dia e Hidroclorotiazida 25mg/dia, mantendo níveis pressóricos em torno de 160x95mmHg. Já foram excluídas causas secundárias de hipertensão. Qual seria a melhor abordagem farmacológica no momento? Existe alguma diretriz recente que recomende uma quarta droga específica?",
      author: {
        id: "user2",
        name: "Dra. Amanda Silva",
        avatar: undefined,
        role: "student",
        specialty: "Cardiologia",
        postCount: 28,
        joinDate: new Date("2024-01-10")
      },
      category: "duvida-conceitual",
      tags: ["hipertensão", "cardiologia", "farmacologia"],
      createdAt: new Date("2025-05-01T09:15:00"),
      likeCount: 12,
      viewCount: 203,
      commentCount: 7
    },
    {
      id: "3",
      title: "Material de estudo recomendado para Pediatria",
      content: "Estou iniciando minha preparação para a residência com foco em Pediatria. Quais livros, artigos e recursos online vocês recomendam? Estou buscando tanto materiais para revisão conceitual quanto questões comentadas. Alguma dica de como organizar o cronograma de estudos também seria muito bem-vinda!",
      author: {
        id: "user3",
        name: "João Almeida",
        avatar: undefined,
        role: "student",
        postCount: 5,
        joinDate: new Date("2025-03-01")
      },
      category: "recursos",
      tags: ["pediatria", "estudo", "residência"],
      createdAt: new Date("2025-05-05T17:45:00"),
      likeCount: 15,
      viewCount: 278,
      commentCount: 12
    },
    {
      id: "4",
      title: "Discussão de caso: Paciente com síndrome nefrótica",
      content: "Gostaria de compartilhar um caso interessante que acompanhei recentemente. Paciente masculino, 22 anos, previamente hígido, iniciou quadro de edema progressivo em membros inferiores há 2 semanas, evoluindo com anasarca, oligúria e urina espumosa. Exames laboratoriais: proteinúria 24h: 5,8g; albumina sérica: 2,1g/dL; colesterol total: 320mg/dL; função renal preservada. A biópsia renal revelou Glomeruloesclerose Segmentar e Focal (GESF).\n\nQuais seriam as abordagens terapêuticas iniciais? Alguém já acompanhou casos semelhantes?",
      author: {
        id: "user4",
        name: "Dr. Ricardo Freitas",
        avatar: undefined,
        role: "expert",
        specialty: "Nefrologia",
        postCount: 42,
        joinDate: new Date("2023-11-15")
      },
      category: "discussao",
      tags: ["nefrologia", "síndrome-nefrótica", "glomerulopatia"],
      createdAt: new Date("2025-05-08T11:20:00"),
      likeCount: 23,
      viewCount: 189,
      commentCount: 9
    },
    {
      id: "5",
      title: "Interpretação de exames laboratoriais em hepatopatias",
      content: "Tenho dificuldade na interpretação dos padrões de alteração das enzimas hepáticas. Como diferenciar de forma eficiente um quadro de hepatite viral de uma doença hepática alcoólica ou medicamentosa apenas com base nos exames laboratoriais iniciais? Existem padrões característicos que podem nos guiar antes mesmo dos exames sorológicos específicos?",
      author: {
        id: "user5",
        name: "Luiza Carvalho",
        avatar: undefined,
        role: "student",
        postCount: 10,
        joinDate: new Date("2024-04-02")
      },
      category: "duvida-conceitual",
      tags: ["gastroenterologia", "hepatologia", "laboratório"],
      createdAt: new Date("2025-05-10T15:30:00"),
      likeCount: 18,
      viewCount: 166,
      commentCount: 6
    }
  ]);
  
  // Comentários de exemplo para o primeiro post
  const [comments, setComments] = useState<ForumComment[]>([
    {
      id: "c1",
      content: "Com esses sinais e sintomas, você está diante de um caso clássico de apendicite aguda. O padrão da dor (iniciando em epigástrio e migrando para FID), associado a náuseas, vômitos, febre e sinais de irritação peritoneal (Blumberg +) são bastante sugestivos. O hemograma corrobora a hipótese. Na maioria dos serviços, este quadro clínico já seria suficiente para indicar laparotomia exploradora ou videolaparoscopia diagnóstica e terapêutica. Entretanto, a TC de abdome é útil para casos menos típicos ou para descartar diagnósticos diferenciais. Se você tem acesso rápido à TC, pode ser útil para confirmar e avaliar complicações como perfuração ou abscesso.",
      author: {
        id: "expert1",
        name: "Dra. Fernanda Motta",
        avatar: undefined,
        role: "expert",
        specialty: "Cirurgia Geral",
        postCount: 238,
        joinDate: new Date("2022-06-10")
      },
      createdAt: new Date("2025-04-25T15:07:00"),
      likeCount: 12,
      isAnswer: true
    },
    {
      id: "c2",
      content: "Concordo com a Dra. Fernanda. O quadro é bastante sugestivo de apendicite aguda. Em muitos serviços, especialmente em hospitais de menor complexidade, a conduta seria cirúrgica baseada na clínica e nos exames laboratoriais. No entanto, acho que vale ressaltar que a ultrassonografia também pode ser uma opção diagnóstica, principalmente em locais onde a TC não está prontamente disponível ou em pacientes jovens, para reduzir exposição à radiação. A sensibilidade não é tão alta quanto a TC, mas é uma alternativa viável.",
      author: {
        id: "user6",
        name: "Dr. Paulo Ribeiro",
        avatar: undefined,
        role: "student",
        specialty: "Emergência",
        postCount: 65,
        joinDate: new Date("2023-09-15")
      },
      createdAt: new Date("2025-04-25T16:20:00"),
      likeCount: 8
    },
    {
      id: "c3",
      content: "Gostaria de acrescentar que, além do diagnóstico, é importante iniciar antibioticoterapia empírica precoce, considerando cobertura para bacilos gram-negativos e anaeróbios. A hidratação venosa e analgesia também são fundamentais antes do procedimento cirúrgico. E não se esqueça de manter o paciente em jejum!",
      author: {
        id: "user7",
        name: "Dr. Antônio Neves",
        avatar: undefined,
        role: "moderator",
        specialty: "Infectologia",
        postCount: 112,
        joinDate: new Date("2023-05-10")
      },
      createdAt: new Date("2025-04-25T18:45:00"),
      likeCount: 10
    }
  ]);
  
  const handleSearch = () => {
    // Implementação de busca
    console.log("Busca por:", searchQuery);
  };
  
  const handleCreatePost = (postData: Omit<ForumPost, 'id' | 'author' | 'createdAt' | 'likeCount' | 'viewCount' | 'commentCount'>) => {
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: postData.title,
      content: postData.content,
      category: postData.category,
      tags: postData.tags,
      author: {
        id: "current-user",
        name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Usuário",
        avatar: user?.profileImageUrl || undefined,
        role: "student",
        postCount: 1,
        joinDate: new Date()
      },
      createdAt: new Date(),
      likeCount: 0,
      viewCount: 1,
      commentCount: 0
    };
    
    setPosts([newPost, ...posts]);
    setShowNewPost(false);
  };
  
  const handleAddComment = (content: string) => {
    if (activePost) {
      const newComment: ForumComment = {
        id: `comment-${Date.now()}`,
        content,
        author: {
          id: "current-user",
          name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Usuário",
          avatar: user?.profileImageUrl || undefined,
          role: "student",
          postCount: 1,
          joinDate: new Date()
        },
        createdAt: new Date(),
        likeCount: 0
      };
      
      setComments([...comments, newComment]);
      
      // Atualizar contagem de comentários do post
      setPosts(posts.map(post => 
        post.id === activePost.id
          ? { ...post, commentCount: post.commentCount + 1 }
          : post
      ));
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Fórum de Discussão</h1>
            <p className="text-muted-foreground">
              Compartilhe conhecimentos, discuta casos clínicos e conecte-se com colegas
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
              <DialogTrigger asChild>
                <Button>
                  <Pen className="h-4 w-4 mr-2" />
                  Nova Postagem
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                  <DialogTitle>Criar nova postagem</DialogTitle>
                  <DialogDescription>
                    Compartilhe sua dúvida, caso clínico ou tópico para discussão com a comunidade.
                  </DialogDescription>
                </DialogHeader>
                <NewPostForm 
                  onSubmit={handleCreatePost} 
                  onCancel={() => setShowNewPost(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Coluna principal */}
          <div className="w-full md:w-3/4">
            {/* Busca e filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar no fórum..."
                  className="pl-9 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="latest">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Mais recentes</SelectItem>
                    <SelectItem value="popular">Mais populares</SelectItem>
                    <SelectItem value="unanswered">Sem resposta</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
            
            {/* Conteúdo principal: lista ou detalhe de post */}
            {activePost ? (
              <div>
                <Button 
                  variant="ghost" 
                  className="mb-4"
                  onClick={() => setActivePost(null)}
                >
                  ← Voltar para tópicos
                </Button>
                <ForumPostDetail 
                  post={activePost} 
                  comments={comments}
                  onAddComment={handleAddComment}
                />
              </div>
            ) : (
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Todos os tópicos</TabsTrigger>
                  <TabsTrigger value="cases">Casos clínicos</TabsTrigger>
                  <TabsTrigger value="discussions">Discussões</TabsTrigger>
                  <TabsTrigger value="resources">Recursos</TabsTrigger>
                  <TabsTrigger value="following">Seguindo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-0">
                  {posts.map((post) => (
                    <div key={post.id} onClick={() => setActivePost(post)} className="cursor-pointer">
                      <ForumPostCard post={post} />
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="cases">
                  {posts.filter(p => p.category === 'caso-clinico').map((post) => (
                    <div key={post.id} onClick={() => setActivePost(post)} className="cursor-pointer">
                      <ForumPostCard post={post} />
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="discussions">
                  {posts.filter(p => p.category === 'discussao' || p.category === 'duvida-conceitual').map((post) => (
                    <div key={post.id} onClick={() => setActivePost(post)} className="cursor-pointer">
                      <ForumPostCard post={post} />
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="resources">
                  {posts.filter(p => p.category === 'recursos').map((post) => (
                    <div key={post.id} onClick={() => setActivePost(post)} className="cursor-pointer">
                      <ForumPostCard post={post} />
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="following">
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">Nenhum tópico seguido</h3>
                    <p className="text-muted-foreground max-w-md mt-2">
                      Você ainda não está seguindo nenhum tópico. Navegue pelos tópicos e clique em "Seguir" para receber atualizações.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
          
          {/* Barra lateral */}
          <div className="w-full md:w-1/4 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Estatísticas do Fórum</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tópicos</span>
                    <span>487</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Respostas</span>
                    <span>2.356</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Membros</span>
                    <span>1.483</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Online agora</span>
                    <span>53</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  Ver mais estatísticas
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tópicos populares</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="text-sm">
                      <a 
                        href="#" 
                        className="hover:text-primary line-clamp-1"
                        onClick={(e) => {
                          e.preventDefault();
                          setActivePost(post);
                        }}
                      >
                        {post.title}
                      </a>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        <span>{post.commentCount} respostas</span>
                        <span className="mx-2">•</span>
                        <Eye className="h-3 w-3 mr-1" />
                        <span>{post.viewCount} visualizações</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Contribuidores ativos</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>RF</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Dr. Ricardo Freitas</p>
                        <p className="text-xs text-muted-foreground">42 posts</p>
                      </div>
                    </div>
                    <Badge variant="outline">Expert</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Dra. Amanda Silva</p>
                        <p className="text-xs text-muted-foreground">28 posts</p>
                      </div>
                    </div>
                    <Badge variant="outline">Cardiologia</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Dr. Antônio Neves</p>
                        <p className="text-xs text-muted-foreground">112 posts</p>
                      </div>
                    </div>
                    <Badge variant="outline">Moderador</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tags populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">cirurgia</Badge>
                  <Badge variant="secondary">cardiologia</Badge>
                  <Badge variant="secondary">pediatria</Badge>
                  <Badge variant="secondary">emergência</Badge>
                  <Badge variant="secondary">neurologia</Badge>
                  <Badge variant="secondary">farmacologia</Badge>
                  <Badge variant="secondary">residência</Badge>
                  <Badge variant="secondary">casos-clínicos</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Diretrizes da comunidade</CardTitle>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground">
                  Respeite a confidencialidade dos pacientes, 
                  mantenha o profissionalismo e evite compartilhar
                  informações médicas sem embasamento científico.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}