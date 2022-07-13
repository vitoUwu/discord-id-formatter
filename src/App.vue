<script>
import DiscordButton from './components/DiscordButton.vue';
import DiscordEmbed from './components/DiscordEmbed.vue';
import DiscordField from './components/DiscordField.vue';
import DiscordActionRow from './components/DiscordActionRow.vue';
import { ContentCopy, Close } from 'mdue';

export default {
  name: "App",
  components: { DiscordButton, DiscordEmbed, DiscordField, DiscordActionRow, ContentCopy, Close },
  data() {
    return {
      textToConvert: null,
      convertedIds: [],
      separator: '\n',
      wumpusDefault: 'Filtre IDs dos logs gerados por bots em seu servidor usando a Embed da esquerda, todos os IDs aparecerão na Embed da direita e então é só copiar ou gerar o arquivo .txt',
      wumpusText: 'Filtre IDs dos logs gerados por bots em seu servidor usando a Embed da esquerda, todos os IDs aparecerão na Embed da direita e então é só copiar ou gerar o arquivo .txt'
    }
  },
  methods: {
    convert(text) {
      this.convertedIds = [...text.matchAll(/\d{16,19}/g)].flat().filter((id, i, arr) => arr.indexOf(id) === i);
    },
    clear() {
      this.$refs.converter.value = '';
      this.convert('');
    },
    convertFile() {
      const supportedExtensions = ['txt', 'log'];
      if (!this.$refs.fileInput.files.length) return this.setMessage('Aparentemente ocorreu um erro ao carregar o seu arquivo pois não consegui identificá-lo');
      const file = this.$refs.fileInput.files[0];
      const extension = file.name.split('.').at(-1);
      if (!supportedExtensions.includes(extension)) return this.setMessage(`O arquivo que você acabou de me enviar não é suportado, a extenção dele é .${extension} e eu só suporto ${supportedExtensions.map(e => `.${e}`).join(', ')}`);
      const fileReader = new FileReader();
      fileReader.onload = (res) => {
        this.$refs.converter.value = res.target.result;
        this.convert(res.target.result);
        this.setMessage();
      }
      fileReader.onerror = (err) => {
        this.setMessage('Ocorreu um erro ao carregar o seu arquivo, tente novamente!');
        console.log(err);
        return;
      }
      fileReader.readAsText(file);
    },
    setMessage(msg) {
      if (!msg) return this.wumpusText = this.wumpusDefault;
      this.wumpusText = msg;
    },
    generateTxt() {
      const a = document.createElement('a');
      a.setAttribute('href', `data:text/plain;chatset=utf-8,${encodeURIComponent(this.convertedIds.join(this.separator))}`);
      a.setAttribute('download', `IDs_${Date.now()}`);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    copy() {
      try {
        navigator.clipboard.writeText(this.convertedIds.join(this.separator));
        this.$refs.popUp.style.top = "32px";
        setTimeout(() => this.$refs.popUp.style.top = "-100%", 5000);
      } catch(err) {
        alert(err);
      }
    },
  }
}
</script>

<template>
  <div class="fixed flex transition-all" ref="popUp" style="top: -100%">
    <div class="h-9 w-auto text-white bg-black rounded-l-full py-[9px] px-[12px] flex items-center shadow-sm shadow-black mr-0.5">
      <ContentCopy class="mr-1"></ContentCopy>
      <p>IDs Copiados</p>
    </div>
    <div class="h-9 w-auto text-white bg-black rounded-r-full py-[9px] px-[12px] flex items-center shadow-sm shadow-black cursor-pointer">
      <Close @click="() => $refs.popUp.style.top = '-100%'"></Close>
    </div>
  </div>

  <div class="px-10 md:px-[100px]">
    <div class="w-full justify-start my-5">
      <div class="flex items-start">
        <img src="./assets/wumpus.png" alt="icon" class="w-12 rounded-full bg-[#fff] mr-3">
        <div>
          <p class="m-0 text-[#fff] font-bold text-lg">Wumpus</p>
          <p class="text-white">{{ wumpusText }}</p>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col md:flex-row justify-between mb-1">
      <div class="w-full md:mr-2">
        <DiscordEmbed title="IDs que serão formatados" class="!max-w-[100%]">
          <template #content>
            <textarea class="bg-transparent outline-none resize-none w-full" cols="20" rows="10" spellcheck="false"
              placeholder="Insira o Texto..." @input="convert($event.target.value)" ref="converter"></textarea>
          </template>
        </DiscordEmbed>
        <DiscordActionRow>
          <input type="file" ref="fileInput" accept=".txt, .log" hidden @change="convertFile()">
          <DiscordButton primary @click="() => $refs.fileInput.click()">Carregar Arquivo</DiscordButton>
        </DiscordActionRow>
      </div>
      <div class="w-full md:ml-2">
        <DiscordEmbed title="IDs encontrados" class="!max-w-[100%]">
          <template #content>
            <textarea class="bg-transparent outline-none resize-none w-full" cols="20" rows="10" spellcheck="false"
              placeholder="IDs convertidos..." disabled="true">{{ convertedIds.join(separator) }}</textarea>
          </template>
          <template #fields>
            <DiscordField name="Quantidade de IDs" codeblock>{{ convertedIds.length }}</DiscordField>
          </template>
        </DiscordEmbed>
        <DiscordActionRow>
          <DiscordButton primary @click="() => separator = '\n'">Texto em Linha</DiscordButton>
          <DiscordButton primary @click="() => separator = ' '">Texto em Coluna</DiscordButton>
          <DiscordButton success @click="copy">Copiar</DiscordButton>
          <DiscordButton danger @click="clear">Limpar</DiscordButton>
          <DiscordButton link @click="generateTxt">Gerar .txt</DiscordButton>
        </DiscordActionRow>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap');

#app {
  height: 100%;
  font-family: 'PT Sans', sans-serif;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

body {
  background-color: #36393f;
}

html,
textarea {
  -webkit-tap-highlight-color: transparent;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

html::-webkit-scrollbar,
textarea::-webkit-scrollbar {
  display: none;
}

textarea {
  line-break: anywhere;
}
</style>
