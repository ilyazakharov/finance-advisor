import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert, Modal, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../store/SettingsContext';
import {
  LLM_PROVIDERS, NEWS_PROVIDERS, QUOTES_PROVIDERS,
  RISK_LEVELS, HORIZONS, CURRENCIES,
  LLM_PROVIDER_INFO, MODELS_BY_PROVIDER, SEARCH_PROVIDER_INFO,
} from '../utils/constants';

function Section({ title, children, isDirty, onSave, onDiscard }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
      {isDirty && (
        <View style={styles.sectionActions}>
          <TouchableOpacity style={styles.discardBtn} onPress={onDiscard}>
            <Text style={styles.discardBtnText}>Отменить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveBtnText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function Select({ options, value, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.selectWrap}>
      <TouchableOpacity style={styles.select} onPress={() => setOpen(!open)}>
        <Text style={styles.selectText}>{options.find((o) => o.id === value)?.label || value}</Text>
        <Text style={styles.selectArrow}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.dropdownItem, value === opt.id && styles.dropdownItemActive]}
              onPress={() => { onSelect(opt.id); setOpen(false); }}
            >
              <Text style={[styles.dropdownItemText, value === opt.id && styles.dropdownItemTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function Input({ label, value, onChange, multiline, keyboardType, placeholder }) {
  return (
    <View style={styles.inputWrap}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
      />
    </View>
  );
}

function InfoModal({ visible, onClose, infoKey }) {
  const insets = useSafeAreaInsets();
  const info = infoKey?.startsWith('search:')
    ? SEARCH_PROVIDER_INFO[infoKey.split(':')[1]]
    : LLM_PROVIDER_INFO[infoKey];
  if (!info) return null;

  const modalBottomPad = (insets.bottom || 16) + 16;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{info.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={{ paddingBottom: modalBottomPad }}
          >
            <Text style={styles.modalSectionTitle}>Плюсы</Text>
            {info.pros.map((p, i) => (
              <Text key={i} style={styles.modalText}>• {p}</Text>
            ))}

            <Text style={styles.modalSectionTitle}>Минусы</Text>
            {info.cons.map((c, i) => (
              <Text key={i} style={styles.modalText}>• {c}</Text>
            ))}

            <Text style={styles.modalSectionTitle}>Как получить ключ</Text>
            {info.steps.map((s, i) => (
              <Text key={i} style={styles.modalText}>{i + 1}. {s}</Text>
            ))}

            <TouchableOpacity style={styles.modalLink} onPress={() => Linking.openURL(info.url)}>
              <Text style={styles.modalLinkText}>Открыть сайт</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function SettingsScreen() {
  const {
    settings, updateSettings,
    saveSection, discardSection, discardAllChanges,
    dirtySections, hasAnyChanges,
    resetSettings,
  } = useSettings();
  const [infoModalKey, setInfoModalKey] = useState(null);

  const currentProvider = settings.llm.provider;
  const models = MODELS_BY_PROVIDER[currentProvider] || MODELS_BY_PROVIDER.groq;

  const handleReset = () => {
    Alert.alert(
      'Сбросить настройки',
      'Все настройки будут сброшены до стандартных. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Сбросить', style: 'destructive', onPress: resetSettings },
      ]
    );
  };

  const updateLLM = (patch) => updateSettings({ llm: { ...settings.llm, ...patch } });
  const updateSearch = (patch) => updateSettings({ search: { ...settings.search, ...patch } });
  const updateInvestor = (patch) => updateSettings({ investor: { ...settings.investor, ...patch } });
  const updateGeneral = (patch) => updateSettings({ general: { ...settings.general, ...patch } });

  return (
    <ScrollView style={styles.container}>
      <Section
        title="LLM (AI провайдер)"
        isDirty={dirtySections.llm}
        onSave={() => saveSection('llm')}
        onDiscard={() => discardSection('llm')}
      >
        <View style={styles.labelRow}>
          <Text style={styles.label}>Провайдер</Text>
          <TouchableOpacity onPress={() => setInfoModalKey(currentProvider)}>
            <Text style={styles.infoIcon}>ⓘ</Text>
          </TouchableOpacity>
        </View>
        <Select
          options={LLM_PROVIDERS}
          value={currentProvider}
          onSelect={(v) => updateLLM({ provider: v })}
        />

        {currentProvider === 'groq' && (
          <Input label="API ключ Groq" value={settings.llm.apiKeys.groq}
            onChange={(v) => updateLLM({ apiKeys: { ...settings.llm.apiKeys, groq: v } })} />
        )}
        {currentProvider === 'gemini' && (
          <Input label="API ключ Google Gemini" value={settings.llm.apiKeys.gemini}
            onChange={(v) => updateLLM({ apiKeys: { ...settings.llm.apiKeys, gemini: v } })} />
        )}
        {currentProvider === 'deepseek' && (
          <Input label="API ключ DeepSeek" value={settings.llm.apiKeys.deepseek}
            onChange={(v) => updateLLM({ apiKeys: { ...settings.llm.apiKeys, deepseek: v } })} />
        )}
        {currentProvider === 'openrouter' && (
          <Input label="API ключ OpenRouter" value={settings.llm.apiKeys.openrouter}
            onChange={(v) => updateLLM({ apiKeys: { ...settings.llm.apiKeys, openrouter: v } })} />
        )}
        {currentProvider === 'yandexgpt' && (
          <Input label="API ключ YandexGPT" value={settings.llm.apiKeys.yandexgpt}
            onChange={(v) => updateLLM({ apiKeys: { ...settings.llm.apiKeys, yandexgpt: v } })} />
        )}
        {currentProvider === 'gigachat' && (
          <Input label="API ключ GigaChat" value={settings.llm.apiKeys.gigachat}
            onChange={(v) => updateLLM({ apiKeys: { ...settings.llm.apiKeys, gigachat: v } })} />
        )}

        <Text style={styles.label}>Модель для базового анализа</Text>
        <Select
          options={models.basic}
          value={settings.llm.modelBasic}
          onSelect={(v) => updateLLM({ modelBasic: v })}
        />

        <Text style={styles.label}>Модель для рекомендаций</Text>
        <Select
          options={models.advanced}
          value={settings.llm.modelAdvanced}
          onSelect={(v) => updateLLM({ modelAdvanced: v })}
        />
      </Section>

      <Section
        title="Поиск данных"
        isDirty={dirtySections.search}
        onSave={() => saveSection('search')}
        onDiscard={() => discardSection('search')}
      >
        <View style={styles.labelRow}>
          <Text style={styles.label}>Поиск новостей</Text>
          <TouchableOpacity onPress={() => setInfoModalKey('search:' + settings.search.newsProvider)}>
            <Text style={styles.infoIcon}>ⓘ</Text>
          </TouchableOpacity>
        </View>
        <Select options={NEWS_PROVIDERS} value={settings.search.newsProvider}
          onSelect={(v) => updateSearch({ newsProvider: v })} />

        <View style={styles.labelRow}>
          <Text style={styles.label}>Поиск котировок</Text>
          <TouchableOpacity onPress={() => setInfoModalKey('search:' + settings.search.quotesProvider)}>
            <Text style={styles.infoIcon}>ⓘ</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.staticValue}>
          <Text style={styles.staticValueText}>MOEX (бесплатно, котировки РФ бумаг)</Text>
        </View>

        {settings.search.newsProvider === 'tavily' && (
          <Input label="API ключ Tavily" value={settings.search.tavilyApiKey}
            onChange={(v) => updateSearch({ tavilyApiKey: v })} />
        )}
      </Section>

      <Section
        title="Профиль инвестора"
        isDirty={dirtySections.investor}
        onSave={() => saveSection('investor')}
        onDiscard={() => discardSection('investor')}
      >
        <Input label="Цель инвестиций" value={settings.investor.goal}
          onChange={(v) => updateInvestor({ goal: v })}
          multiline placeholder="Например: накопить на квартиру через 5 лет" />

        <Text style={styles.label}>Горизонт инвестиций</Text>
        <Select options={HORIZONS} value={settings.investor.horizon}
          onSelect={(v) => updateInvestor({ horizon: v })} />

        <Text style={styles.label}>Степень риска</Text>
        <Select options={RISK_LEVELS} value={settings.investor.riskLevel}
          onSelect={(v) => updateInvestor({ riskLevel: v })} />

        <Input label="Ежемесячный взнос (руб)" value={settings.investor.monthlyContribution}
          onChange={(v) => updateInvestor({ monthlyContribution: v })} keyboardType="numeric" />
        <Input label="Текущий капитал (руб)" value={settings.investor.currentCapital}
          onChange={(v) => updateInvestor({ currentCapital: v })} keyboardType="numeric" />
      </Section>

      <Section
        title="Общие"
        isDirty={dirtySections.general}
        onSave={() => saveSection('general')}
        onDiscard={() => discardSection('general')}
      >
        <Text style={styles.label}>Валюта</Text>
        <Select options={CURRENCIES} value={settings.general.currency}
          onSelect={(v) => updateGeneral({ currency: v })} />
      </Section>

      {hasAnyChanges && (
        <TouchableOpacity style={styles.discardAllBtn} onPress={discardAllChanges}>
          <Text style={styles.discardAllBtnText}>Отменить все изменения</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Text style={styles.resetBtnText}>Сбросить настройки</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

      <InfoModal
        visible={!!infoModalKey}
        onClose={() => setInfoModalKey(null)}
        infoKey={infoModalKey}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginBottom: 16 },
  sectionActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  saveBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  discardBtn: { borderWidth: 1, borderColor: '#FF3B30', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  discardBtnText: { color: '#FF3B30', fontSize: 14, fontWeight: '500' },
  discardAllBtn: { marginHorizontal: 16, marginTop: 12, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#FF9500', alignItems: 'center' },
  discardAllBtnText: { color: '#FF9500', fontSize: 14, fontWeight: '500' },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, marginTop: 8 },
  label: { fontSize: 13, fontWeight: '500', color: '#555', marginBottom: 6, marginTop: 8 },
  infoIcon: { fontSize: 18, color: '#007AFF', marginLeft: 6, paddingHorizontal: 4 },
  staticValue: { padding: 12, borderRadius: 8, backgroundColor: '#f0f8ff', marginBottom: 8 },
  staticValueText: { fontSize: 14, color: '#333' },
  selectWrap: { marginBottom: 8 },
  select: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#fafafa' },
  selectText: { fontSize: 14, color: '#333' },
  selectArrow: { fontSize: 12, color: '#999' },
  dropdown: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: 4, backgroundColor: '#fff' },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemActive: { backgroundColor: '#e8f0fe' },
  dropdownItemText: { fontSize: 14, color: '#333' },
  dropdownItemTextActive: { color: '#007AFF', fontWeight: '600' },
  inputWrap: { marginBottom: 8 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: '#555', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 14, backgroundColor: '#fafafa' },
  inputMultiline: { minHeight: 60, textAlignVertical: 'top' },
  resetBtn: { marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FF3B30', alignItems: 'center' },
  resetBtnText: { color: '#FF3B30', fontSize: 15, fontWeight: '500' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  modalClose: { fontSize: 20, color: '#999', padding: 4 },
  modalBody: { padding: 16 },
  modalSectionTitle: { fontSize: 15, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  modalText: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 4 },
  modalLink: { marginTop: 16, padding: 14, backgroundColor: '#007AFF', borderRadius: 12, alignItems: 'center' },
  modalLinkText: { fontSize: 15, color: '#fff', fontWeight: '600' },
});
