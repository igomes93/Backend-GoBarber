import Bee from 'bee-queue'; // Vamos importar o Queue para configuração das filas
import CancellationMail from '../app/jobs/CancellationMail' // importamos nosso primeiro job
import redisConfig from '../config/redis';

const jobs = [CancellationMail]; // toda vez que tivermos um novo job, importamos e incluimos nesse array

class Queue {
    constructor() {
        this.queues = {}; // configuração das filas cada tipo de Background Job terá sua propria fila, envio de cancelamento de e-mail tera sua porpria fila, evio de email para recadastrar senha terá sua propira fila tbm.

        this.init();
    }

    init() {
        jobs.forEach(({ key, handle }) => { // para cada job recebemos nosso job em si/ vamos ecassar os metodos e propridades da classe atrves da desestruturação
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,

                }),
                handle,
            };

        });

    }

    add(queue, job) { // metodo para adc novos trabalhos dentro de casa fila
        return this.queues[queue].bee.createJob(job).save(); // toda ves que chamarmos o metodo ele vai botar o trabalho na fila em background

    }

    processQueue() { // processando as queues
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];

            bee.on('failed', this.handleFailure).process(handle); // .on('failed') é o evento para monitorarmos falhas na fila
        })

    }

    handleFailure(job, err) {

        console.log(`Queue ${job.queue.name}: FAILED`, err)
    }




}

export default new Queue();
