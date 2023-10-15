<script setup lang="ts">
import { Copy, X } from "lucide-vue-next";
import { computed, reactive, ref } from "vue";
import DiscordActionRow from "./components/DiscordActionRow.vue";
import DiscordButton from "./components/DiscordButton.vue";
import DiscordEmbed from "./components/DiscordEmbed.vue";
import DiscordField from "./components/DiscordField.vue";

const MESSAGES = {
  FILE_LOAD_ERROR:
    "Ocorreu um erro ao carregar o seu arquivo, tente novamente!",
  UNSUPPORTED_FILE_ERROR:
    "O arquivo que você acabou de me enviar não é suportado",
  DEFAULT:
    "Filtre IDs dos logs gerados por bots em seu servidor usando a Embed da esquerda, todos os IDs aparecerão na Embed da direita e então é só copiar ou gerar o arquivo .txt",
};

const popup = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const textInput = ref<HTMLInputElement | null>(null);
const state = reactive({
  message: MESSAGES["DEFAULT"],
  separator: "\n",
  ids: [] as string[],
});

const convertedText = computed(() => state.ids.join(state.separator));
const isEmpty = computed(() => state.ids.length === 0);

function copy() {
  try {
    navigator.clipboard.writeText(convertedText.value);
    if (popup.value) {
      popup.value.style.top = "12px";
      setTimeout(() => (popup.value!.style.top = "-10%"), 5000);
    }
  } catch (err) {
    console.error(err);
  }
}

function convert(text: string) {
  state.ids = [...text.matchAll(/\d{15,18}/g)]
    .flat()
    .filter((id, i, arr) => arr.indexOf(id) === i)
    .sort((a, b) => Number(a) - Number(b));
}

function clear() {
  state.ids = [];
  if (textInput.value) {
    textInput.value.value = "";
  }
}

function convertFile() {
  if (!fileInput.value) {
    return;
  }

  if (!fileInput.value.files?.length) {
    state.message = MESSAGES["FILE_LOAD_ERROR"];
    return;
  }

  const file = fileInput.value.files[0];

  if (file.type !== "text/plain") {
    state.message = MESSAGES["UNSUPPORTED_FILE_ERROR"];
    return;
  }

  const fileReader = new FileReader();

  fileReader.onload = (res) => {
    if (!res.target) {
      state.message = MESSAGES["FILE_LOAD_ERROR"];
      return;
    }

    const result =
      res.target.result instanceof ArrayBuffer
        ? new TextDecoder("utf-8").decode(res.target.result)
        : res.target.result;

    if (!result) {
      state.message = MESSAGES["FILE_LOAD_ERROR"];
      if (res.target.error) {
        console.error(res.target.error);
      }
      return;
    }

    if (textInput.value) {
      textInput.value.value = result;
    }
    fileInput.value!.value = "";
    convert(result);
    state.message = MESSAGES["DEFAULT"];
  };

  fileReader.onerror = (err) => {
    state.message = MESSAGES["FILE_LOAD_ERROR"];
    console.log(err);
    return;
  };

  fileReader.readAsText(file);
}

function generateTxtFile() {
  const a = document.createElement("a");
  a.setAttribute(
    "href",
    `data:text/plain;chatset=utf-8,${encodeURIComponent(convertedText.value)}`
  );
  a.setAttribute("download", `IDs_${Date.now()}`);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function closePopup() {
  if (!popup.value) {
    return;
  }

  popup.value.style.top = "-10%";
}

function onTextInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  convert(target.value);
}
</script>

<template>
  <div
    class="fixed flex items-center justify-center gap-0.5 text-white transition-all duration-500 select-none"
    ref="popup"
    style="top: -10%"
  >
    <div
      class="flex items-center justify-center gap-1 px-4 bg-black rounded-l-full shadow-sm h-9"
    >
      <Copy :size="18" />
      <p>IDs Copiados</p>
    </div>
    <button
      class="flex items-center justify-center bg-black rounded-r-full shadow-sm h-9 w-9"
      @click="closePopup"
    >
      <X class="pop" :size="18" />
    </button>
  </div>

  <div class="w-full max-w-screen-xl px-10">
    <header class="w-full my-5 text-white">
      <h1 class="fixed -top-full">Discord ID Formatter</h1>
      <div class="flex items-start gap-3">
        <img
          src="./assets/wumpus.png"
          alt="wumpus"
          class="w-12 h-12 rounded-full aspect-square"
        />
        <div>
          <p class="text-lg font-bold">Wumpus</p>
          <p>{{ state.message }}</p>
        </div>
      </div>
    </header>
    <main class="flex flex-col justify-between w-full md:gap-4 md:flex-row">
      <section id="Texto que será formatado" class="w-full">
        <DiscordEmbed>
          <template #title>
            <h2 class="text-xl font-bold">IDs que serão formatados</h2>
          </template>
          <template #content>
            <textarea
              class="w-full p-1 bg-transparent outline-none resize-none"
              cols="20"
              rows="10"
              spellcheck="false"
              placeholder="Insira o Texto..."
              ref="textInput"
              @input="onTextInput"
            ></textarea>
          </template>
        </DiscordEmbed>
        <DiscordActionRow>
          <input
            type="file"
            ref="fileInput"
            accept=".txt, .log"
            hidden
            @change="convertFile"
          />
          <DiscordButton primary @click="() => fileInput?.click()"
            >Carregar Arquivo</DiscordButton
          >
        </DiscordActionRow>
      </section>
      <section id="Ids formatados" class="w-full">
        <DiscordEmbed>
          <template #title>
            <h2 class="text-xl font-bold">IDs encontrados</h2>
          </template>
          <template #content>
            <textarea
              class="w-full p-1 bg-transparent outline-none resize-none"
              cols="20"
              rows="10"
              spellcheck="false"
              placeholder="IDs convertidos..."
              disabled="true"
              >{{ convertedText }}</textarea
            >
          </template>
          <template #fields>
            <DiscordField name="Quantidade de IDs" codeblock>{{
              state.ids.length
            }}</DiscordField>
          </template>
        </DiscordEmbed>
        <DiscordActionRow>
          <DiscordButton
            :disabled="isEmpty"
            primary
            @click="() => (state.separator = '\n')"
            >Texto em Linha</DiscordButton
          >
          <DiscordButton
            :disabled="isEmpty"
            primary
            @click="() => (state.separator = ' ')"
            >Texto em Coluna</DiscordButton
          >
          <DiscordButton :disabled="isEmpty" success @click="copy"
            >Copiar</DiscordButton
          >
          <DiscordButton :disabled="isEmpty" danger @click="clear"
            >Limpar</DiscordButton
          >
          <DiscordButton
            :disabled="isEmpty"
            link
            @click="generateTxtFile"
            >Gerar .txt</DiscordButton
          >
        </DiscordActionRow>
      </section>
    </main>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap");

#app {
  height: 100%;
  font-family: "PT Sans", sans-serif;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
</style>
