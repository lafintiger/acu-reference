import React, { useState, useEffect } from 'react';
import { GraduationCap, Brain, Trophy, Clock, Star, Play, BookOpen, Target } from 'lucide-react';
import { pointLocationQuizzes, learningModules } from '../data/educational-content';

const Education = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'quizzes' | 'modules' | 'progress'>('overview');
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [quizInProgress, setQuizInProgress] = useState(false);

  const startQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setQuizInProgress(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Learning Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <GraduationCap className="h-8 w-8 text-tcm-accent mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Beginner Path</h3>
              <p className="text-gray-600 text-sm">Start your TCM journey</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 mb-4">
            <li>• Five Element Theory Basics</li>
            <li>• Essential Point Locations</li>
            <li>• Safety and Contraindications</li>
            <li>• Basic Treatment Protocols</li>
          </ul>
          <button className="w-full px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark">
            Start Learning Path
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Brain className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Advanced Practice</h3>
              <p className="text-gray-600 text-sm">Deepen your expertise</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 mb-4">
            <li>• Complex Pattern Recognition</li>
            <li>• Multi-Modal Integration</li>
            <li>• Clinical Case Studies</li>
            <li>• Research and Evidence</li>
          </ul>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Continue Advanced Studies
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-tcm-accent">{pointLocationQuizzes.length}</div>
          <div className="text-sm text-gray-600">Available Quizzes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{learningModules.length}</div>
          <div className="text-sm text-gray-600">Learning Modules</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">160+</div>
          <div className="text-sm text-gray-600">Points to Master</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">4</div>
          <div className="text-sm text-gray-600">Modalities</div>
        </div>
      </div>
    </div>
  );

  const renderQuizzes = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pointLocationQuizzes.map(quiz => (
          <div key={quiz.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
              </div>
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>

            <p className="text-gray-700 text-sm mb-4">{quiz.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-gray-500 mr-2" />
                <span>{quiz.questions.length} questions</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-gray-500 mr-2" />
                <span>{quiz.passingScore}% to pass</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span>{quiz.timeLimit || 'No'} time limit</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                <span className="capitalize">{quiz.category}</span>
              </div>
            </div>

            <button
              onClick={() => startQuiz(quiz)}
              className="w-full flex items-center justify-center px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {learningModules.map(module => (
          <div key={module.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </span>
              </div>
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>

            <p className="text-gray-700 text-sm mb-4">{module.description}</p>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span>{module.estimatedDuration} minutes</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                <span>{module.sections.length} sections</span>
              </div>
              {module.quiz && (
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 text-gray-500 mr-2" />
                  <span>Includes assessment quiz</span>
                </div>
              )}
            </div>

            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Start Module
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (quizInProgress && selectedQuiz) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{selectedQuiz.title}</h1>
            <button
              onClick={() => setQuizInProgress(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Exit Quiz
            </button>
          </div>

          {/* Quiz Interface */}
          <div className="space-y-6">
            {selectedQuiz.questions.map((question: any, index: number) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Question {index + 1} of {selectedQuiz.questions.length}
                  </h3>
                  <span className="text-sm text-gray-500">{question.points} points</span>
                </div>

                <p className="text-gray-800 mb-4">{question.question}</p>

                {question.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {question.options.map((option: string, optionIndex: number) => (
                      <label key={optionIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          value={optionIndex}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'true_false' && (
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name={`question_${question.id}`} value="true" className="mr-3" />
                      <span className="text-gray-700">True</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name={`question_${question.id}`} value="false" className="mr-3" />
                      <span className="text-gray-700">False</span>
                    </label>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-center">
              <button className="px-6 py-3 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark">
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="h-8 w-8 text-tcm-accent mr-3" />
            TCM Education Center
          </h1>
          <p className="text-gray-600 mt-1">
            Interactive learning modules, quizzes, and knowledge assessment tools
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'quizzes', label: 'Quizzes', icon: Trophy },
              { id: 'modules', label: 'Learning Modules', icon: BookOpen },
              { id: 'progress', label: 'Progress', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-tcm-accent text-tcm-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'quizzes' && renderQuizzes()}
          {activeTab === 'modules' && renderModules()}
          {activeTab === 'progress' && (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p>Progress tracking coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Education;
