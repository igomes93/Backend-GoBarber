// esse arquivo vai importar nosso queue, serve para não executar a aplicação no mesmo node, para a fila não influenciar na aplicação

import Queue from "./lib/Queue";

Queue.processQueue();
