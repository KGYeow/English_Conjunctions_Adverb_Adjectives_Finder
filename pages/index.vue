<template>
  <v-row>
    <v-col cols="12">
      <SharedUiCard title="English Conjunctions/Adverb/Adjectives Finder" height="fit-content" :header="false" :footer="false">
        <div class="text-body-1">
          <v-row>
            <v-col cols="7" class="pe-5">
              <v-sheet>
                <!-- Card Title -->
                <div class="pe-3 d-sm-flex align-center justify-space-between">
                  <v-card-title class="text-h5 px-0 pt-0 d-flex align-center">English Conjunctions/Adverb/Adjectives Finder</v-card-title>
                </div>
                <p class="pe-3" style="text-align: justify;">
                  This is the English conjunctions/adverb/adjectives finder using Deterministic Finite Automata (DFA).
                </p>
                <!-- Text Input -->
                <div class="pe-3" v-if="statusList.length == 0">
                  <form @submit.prevent="runDFA" >
                    <div class="text-body-1">
                      <v-textarea
                        density="compact"
                        variant="outlined"
                        rows="14"
                        v-model="text"
                        hide-details
                        no-resize
                        :disabled = "isProcess"
                      />
                    </div>
                    <div class="px-0 py-3 text-right" v-if="isProcess">
                      <v-progress-linear indeterminate/>
                      <div class="py-1">In process...</div>
                    </div>
                    <v-card-actions class="px-0 pt-3 pb-0 float-right" v-else>
                      <v-file-input
                        class="d-none"
                        ref="uploadFileInput"
                        v-model:model-value="addFileInfo"
                        @update:model-value="addFile"
                        :accept="`.txt`"
                        hide-details
                      />
                      <v-btn color="primary" variant="elevated" @click="uploadFileInput.click()">Upload Text File</v-btn>
                      <v-btn color="primary" variant="elevated" type="submit">Submit</v-btn>
                    </v-card-actions>
                  </form>
                </div>
                <!-- Result/Output text -->
                <div v-else>
                  <el-scrollbar height="418px" always>
                    <div class="me-3 p-2 bg-background" v-html="outputText" style="min-height: 418px;"></div>
                  </el-scrollbar>
                  <div class="pt-3 pe-2 float-end">
                    <v-btn color="primary" @click="reset">Enter Another New Text</v-btn>
                  </div>
                </div>
              </v-sheet>
            </v-col>
            <v-divider class="my-2" vertical/>
            <v-col cols="5" class="ps-8">
              <v-sheet rounded="1" color="grey200">
                <v-row class="m-0 mb-3">
                  <v-col cols="4">
                    <v-card-title class="text-subtitle-1 py-0">Total</v-card-title>
                    <v-card-title class="text-h4 py-0">
                      <v-tooltip :text="`Total Results: ${resultInfo.total}`" activator="parent" location="top" offset="5"/>
                      {{ resultInfo.total }}
                    </v-card-title>
                  </v-col>
                  <v-col cols="4">
                    <v-card-title class="text-subtitle-1 py-0">Accepted</v-card-title>
                    <v-card-title class="text-h4 py-0">
                      <v-tooltip :text="`Total Accepted: ${resultInfo.accepted}`" activator="parent" location="top" offset="5"/>
                      {{ resultInfo.accepted }}
                    </v-card-title>
                  </v-col>
                  <v-col cols="4">
                    <v-card-title class="text-subtitle-1 py-0">Rejected</v-card-title>
                    <v-card-title class="text-h4 py-0">
                      <v-tooltip :text="`Total Rejected: ${resultInfo.rejected}`" activator="parent" location="top" offset="5"/>
                      {{ resultInfo.rejected }}
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-sheet>
              <!-- No Result Information -->
              <el-empty :image-size="200" description="No Result Information" v-if="statusList.length == 0"/>
              <div v-else>
                <!-- Result Information Table -->
                <el-scrollbar class="mt-1" height="450px" always>
                  <v-data-table
                    density="compact"
                    v-model:page="currentPage"
                    :headers="[
                      { key: 'word', title: 'Word' },
                      { key: 'occurrence', title: 'Occurrence' },
                      { key: 'status', title: 'Status' },
                    ]"
                    :sort-by="[{ key: 'word', order: 'asc' }]"
                    sort-desc-icon="mdi-arrow-down-thin"
                    sort-asc-icon="mdi-arrow-up-thin"
                    :items="statusList"
                    :items-per-page="itemsPerPage"
                    hover
                  >
                    <template #item="{ item }">
                      <tr>
                        <td>
                          <v-list-item class="p-0 text-nowrap">
                            <div>
                              <v-tooltip :text="item.word" activator="parent" location="left" offset="5"/>
                              {{ item.word }}
                            </div>
                          </v-list-item>
                        </td>
                        <td>{{ item.occurrence }}</td>
                        <td>
                          <el-tag :type="item.status ? 'success' : 'danger'" effect="dark">
                            {{ item.status ? 'Accepted' : 'Rejected' }}
                          </el-tag>
                        </td>
                      </tr>
                    </template>
                    <template #bottom>
                    </template>
                  </v-data-table>
                </el-scrollbar>
                <!-- Result Information Table Pagination -->
                <el-pagination
                  class="justify-content-end mt-1"
                  layout="prev, pager, next"
                  v-model:current-page="currentPage"
                  :page-size="statusList.length/pageCount()"
                  :pager-count="5"
                  :total="statusList.length"
                  hide-on-single-page
                  small
                  v-if="statusList.length != 0"
                />
              </div>
            </v-col>
          </v-row>
        </div>
      </SharedUiCard>
    </v-col>
  </v-row>
</template>

<script setup>
// Data
const uploadFileInput = ref(null)
const addFileInfo = ref(null)
const text = ref('')
const processedText = ref('')
const outputText = ref('')
const statusList = ref([])
const resultInfo = ref({
  total: 0,
  accepted: 0,
  rejected: 0
})
const currentPage = ref(1)
const itemsPerPage = ref(25)
const isProcess = ref(false)

const pageCount = () => {
  return Math.ceil(statusList.value.length / itemsPerPage.value)
}
const preprocessingText = (text) => {
  const noNewLines = text.replace(/\n/g, ' ') // Remove newlines
  const noNumPunctuation = noNewLines.replace(/[^a-zA-Z ]/g, ' ') // Remove all numbers and punctuations
  const trimmedText = noNumPunctuation.trim().replace(/\s\s+/g, ' ') // Remove extra whitespace
  const lowercaseText = trimmedText.toLowerCase() // Convert to lowercase
  return lowercaseText
}
const runDFA = () => {
  statusList.value = [] // Reset statusList
  processedText.value = text.value
  outputText.value = text.value

  if (/^\s+$/.test(processedText.value)) { // Check for only whitespaces
    text.value = ''
    processedText.value = ''
    outputText.value = ''
  }

  if (processedText.value != '') {
    isProcess.value = true
    processedText.value = preprocessingText(processedText.value);
    const wordList = processedText.value.split(/\s+/) // Split on any whitespace

    for (const string of wordList) {
      const status = useDFA.$run(string)
      const existingWord = statusList.value.find(item => item.word == string); // Find the corresponding object in statusList

      if (existingWord) {
        existingWord.occurrence++; // Increment occurrence to the word in statusList
      } else {
        statusList.value.push({ word: string, occurrence: 1, status })
      }
    }

    // Count the total accepted and rejected words
    resultInfo.value.total = statusList.value.length
    for (const item of statusList.value) {
      if (item.status) {
        resultInfo.value.accepted++;
      } else {
        resultInfo.value.rejected++;
      }
    }

    outputText.value = outputText.value.replace(/\n/g, '<br>');
    ElNotification.success({ message: "The DFA run successfully" })
    isProcess.value = false
  }
}
const addFile = () => {
  const file = addFileInfo.value[0]
  if (file)
  {
    const extension = file.name.slice(file.name.lastIndexOf("."))
    if (extension != ".txt") {
      ElNotification.error({ message: "Invalid file extension; only files in txt format are accepted" })
      addFileInfo.value = null
      return
    }

    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      text.value = reader.result
      runDFA()
    }
  }
  else {
    addFileInfo.value = null
  }
}
const reset = () => {
  addFileInfo.value = null
  text.value = ''
  processedText.value = ''
  outputText.value = ''
  statusList.value = []
  resultInfo.value.total = 0
  resultInfo.value.accepted = 0
  resultInfo.value.rejected = 0
  currentPage.value = 1
}
</script>