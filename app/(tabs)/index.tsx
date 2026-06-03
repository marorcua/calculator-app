/** @format */
import { FrequencySelector } from '@/components/FrequencySelector'
import { InputField } from '@/components/InputField'
import { NumberRoulette } from '@/components/NumberRoulette'
import { PresetButtons } from '@/components/PresetButtons'
import { ResultCard } from '@/components/ResultCard'
import { useCompoundInterestCalculator } from '@/hooks/useCompoundInterestCalculator'
import { usePersistence } from '@/hooks/usePersistence'
import { CalculatorData, CompoundingFrequency } from '@/types/calculator'
import { validateCalculatorData } from '@/utils/validation'
import { PiggyBank, Settings2 } from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'

export default function InterestScreen() {
  const [data, setData, isLoaded] = usePersistence<CalculatorData>(
    'interest_data',
    {
      principal: '10000',
      rate: '5',
      years: '10',
      frequency: 'monthly'
    }
  )
  const [showConditions, setShowConditions] = useState(false);

  const result = useCompoundInterestCalculator(data)
  const errors = validateCalculatorData(data)
  const principal = parseFloat(data.principal) || 0

  const updateField = useCallback(
    (field: keyof CalculatorData, value: string) => {
      setData({ ...data, [field]: value })
    },
    [data, setData]
  )

  const handlePrincipalChange = useCallback(
    (val: number) => {
      updateField('principal', String(val))
    },
    [updateField]
  )

  const handleFrequencyChange = useCallback(
    (freq: CompoundingFrequency) => {
      updateField('frequency', freq)
    },
    [updateField]
  )

  if (!isLoaded) return null

  const getPrincipalError = errors.find((e) => e.field === 'principal')?.message
  const getRateError = errors.find((e) => e.field === 'rate')?.message
  const getYearsError = errors.find((e) => e.field === 'years')?.message

  return (
    <View className='flex-1 bg-gradient-to-br from-blue-50 to-indigo-100'>
      <ScrollView
        className='p-6'
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className='flex-row items-center mb-8'>
          <View className='bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl mr-4'>
            <PiggyBank
              size={28}
              color='white'
            />
          </View>
          <View>
            <Text className='text-3xl font-bold text-gray-900'>Investment</Text>
            <Text className='text-sm text-gray-600'>
              Calculate your savings growth
            </Text>
          </View>
        </View>

        {/* Input Card */}
        <View className='bg-white p-8 rounded-3xl shadow-lg mb-6 border border-blue-100'>
          <View className='mb-8'>
            <Text className='text-sm font-bold text-gray-600 mb-4 ml-1 uppercase tracking-wide'>
              Loan Amount
            </Text>
            <NumberRoulette
              value={principal}
              onChange={handlePrincipalChange}
              min={0}
              max={1000000}
              step={5000}
              error={getPrincipalError}
            />
          </View>

          {/* Toggle Conditions */}
          <Pressable
            onPress={() => setShowConditions(!showConditions)}
            className="flex-row items-center mb-6 p-3 rounded-xl bg-blue-50 border border-blue-100"
          >
            <Settings2 size={20} color="#3b82f6" style={{ marginRight: 8 }} />
            <Text className="text-blue-700 font-semibold">
              {showConditions ? 'Hide Conditions' : 'Show Conditions'}
            </Text>
          </Pressable>

          {showConditions && (
            <View>
              {/* Annual Rate */}
              <InputField
                label='Annual Rate'
                value={data.rate}
                onChangeText={(v) => updateField('rate', v)}
                placeholder='0.00%'
                keyboardType='decimal-pad'
                error={getRateError}
              />

              {/* Years */}
              <InputField
                label='Years'
                value={data.years}
                onChangeText={(v) => updateField('years', v)}
                placeholder='0'
                keyboardType='numeric'
                error={getYearsError}
              />
            </View>
          )}

          {/* Compounding Frequency */}
          <FrequencySelector
            value={data.frequency}
            onChange={handleFrequencyChange}
          />
        </View>

        {/* Result Card */}
        <ResultCard
          result={result}
          principal={principal}
        />
      </ScrollView>
    </View>
  )
}
